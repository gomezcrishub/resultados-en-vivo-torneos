import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to proxy Google Docs CSV download and parse it
  app.get("/api/import", async (req, res) => {
    try {
      const spreadsheetId = "1gEJPn4l5OIzl28Fj1DrF_KhrGRuIkKGBovap4PZpBbw";
      
      // Step 1: Fetch htmlview to find sheet gids and names
      const htmlUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/htmlview`;
      const htmlRes = await fetch(htmlUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }
      });
      if (!htmlRes.ok) {
        throw new Error(`No se pudo cargar la planilla de Google Sheets: ${htmlRes.statusText}`);
      }
      const html = await htmlRes.text();

      const sheets: { gid: string; name: string }[] = [];
      const seenGids = new Set<string>();

      // 1. Try to find items.push({name: "...", pageUrl: "..."}) script elements
      const itemsRegex = /items\.push\(\{name:\s*"([^"]+)",\s*pageUrl:\s*"([^"]+)"/gi;
      let match;
      while ((match = itemsRegex.exec(html)) !== null) {
        let name = match[1].trim()
          .replace(/\\x2d/g, "-")
          .replace(/\\x3d/g, "=")
          .replace(/\\x3f/g, "?")
          .replace(/\\x26/g, "&")
          .replace(/\\/g, "")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">");
        
        const pageUrl = match[2].replace(/\\/g, "");
        const gidMatch = /gid=([a-zA-Z0-9_-]+)/i.exec(pageUrl);
        const gid = gidMatch ? gidMatch[1] : null;
        if (gid && name && !seenGids.has(gid)) {
          seenGids.add(gid);
          sheets.push({ gid, name });
        }
      }

      // 2. Fallbacks (original regexes to be backwards-compatible)
      if (sheets.length === 0) {
        // Match tab lists in bottom menu
        const tabRegex = /id="sheet-button-([^"]+)"[^>]*><a[^>]+href="[^"]*gid=([^"&]+)[^"]*"[^>]*>([^<]+)<\/a>/gi;
        while ((match = tabRegex.exec(html)) !== null) {
          const gid = match[2];
          const name = match[3].trim().replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
          if (gid && name && !seenGids.has(gid)) {
            seenGids.add(gid);
            sheets.push({ gid, name });
          }
        }
      }

      if (sheets.length === 0) {
        // Check looser regex if empty
        const tabRegex2 = /<li[^>]*><a[^>]+href="[^"]*gid=([^"&]+)[^"]*"[^>]*>([^<]+)<\/a><\/li>/gi;
        while ((match = tabRegex2.exec(html)) !== null) {
          const gid = match[1];
          const name = match[2].trim().replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
          if (gid && name && !seenGids.has(gid)) {
            seenGids.add(gid);
            sheets.push({ gid, name });
          }
        }
      }

      if (sheets.length === 0) {
        // Check JSON bootstrap data fallback
        const jsonRegex = /"sheetId"\s*:\s*([0-9]+)\s*,\s*"title"\s*:\s*"([^"]+)"/gi;
        while ((match = jsonRegex.exec(html)) !== null) {
          const gid = match[1];
          let name = match[2].replace(/\\u([0-9a-fA-F]{4})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)));
          name = name.trim().replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
          if (gid && name && !seenGids.has(gid)) {
            seenGids.add(gid);
            sheets.push({ gid, name });
          }
        }
      }

      if (sheets.length === 0) {
        sheets.push({ gid: "0", name: "Torneo Principal" });
      }

      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const parseSetScore = (setStr: string | undefined | null) => {
        if (!setStr) return null;
        const clean = setStr.trim();
        if (!clean) return null;
        
        const parts = clean.split(/[-/\x20]/).map(s => s.trim()).filter(Boolean);
        if (parts.length < 2) return null;
        
        const g1 = parseInt(parts[0], 10);
        const g2 = parseInt(parts[1], 10);
        if (isNaN(g1) || isNaN(g2)) return null;
        
        return {
          g1,
          g2,
          winner: g1 > g2 ? 1 : (g2 > g1 ? 2 : null)
        };
      };

      // Step 2: Fetch CSV for each sheet in parallel
      const tournaments = await Promise.all(
        sheets.map(async (sheet) => {
          try {
            const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheet.gid}`;
            const csvRes = await fetch(csvUrl);
            if (!csvRes.ok) {
              throw new Error(`No se pudo descargar el CSV para la hoja ${sheet.name}`);
            }
            const csvText = await csvRes.text();
            const lines = csvText.split(/\r?\n/);
            const matches: any[] = [];
            
            let idx = 0;
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              
              const cleanLine = trimmed.replace(/^\uFEFF/, "");
              const cols = parseCSVLine(cleanLine);
              
              if (cols.length >= 3) {
                const grupo = cols[0] || "";
                const pareja1 = cols[1] || "";
                const pareja2 = cols[2] || "";
                
                const gLower = grupo.toLowerCase();
                const isPlayoffGroup = gLower.includes("octavo") || gLower.includes("cuarto") || gLower.includes("semi") || gLower.includes("final");
                
                // Skip headers or records without parejas, unless it's a playoff round
                if (!pareja1 && !pareja2 && !isPlayoffGroup) continue;
                if (grupo.toLowerCase().startsWith("grupo") || (pareja1 && pareja1.toLowerCase().startsWith("pareja"))) {
                  continue;
                }

                const set1Str = cols[3] || "";
                const set2Str = cols[4] || "";
                const set3Str = cols[5] || "";

                const set1 = parseSetScore(set1Str);
                const set2 = parseSetScore(set2Str);
                const set3 = parseSetScore(set3Str);

                let setsWon1 = 0;
                let setsWon2 = 0;
                let juegos1 = 0;
                let juegos2 = 0;
                let hasData = false;

                if (set1) {
                  hasData = true;
                  juegos1 += set1.g1;
                  juegos2 += set1.g2;
                  if (set1.winner === 1) setsWon1++;
                  if (set1.winner === 2) setsWon2++;
                }
                if (set2) {
                  hasData = true;
                  juegos1 += set2.g1;
                  juegos2 += set2.g2;
                  if (set2.winner === 1) setsWon1++;
                  if (set2.winner === 2) setsWon2++;
                }
                if (set3) {
                  hasData = true;
                  juegos1 += set3.g1;
                  juegos2 += set3.g2;
                  if (set3.winner === 1) setsWon1++;
                  if (set3.winner === 2) setsWon2++;
                }

                const estado = hasData ? "Jugado" : "Pendiente";
                const gamePareja1 = hasData ? setsWon1 : null;
                const gamePareja2 = hasData ? setsWon2 : null;

                idx++;
                matches.push({
                  id: `${sheet.gid}-${grupo}-${pareja1}-${pareja2}-${idx}`.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                  grupo,
                  pareja1,
                  pareja2,
                  gamePareja1,
                  gamePareja2,
                  juegosPareja1: juegos1,
                  juegosPareja2: juegos2,
                  estado,
                  set1: set1Str || null,
                  set2: set2Str || null,
                  set3: set3Str || null
                });
              }
            }

            return {
              id: sheet.gid,
              name: sheet.name,
              matches
            };
          } catch (err: any) {
            console.error(`Error parsing sheet ${sheet.name}:`, err);
            return {
              id: sheet.gid,
              name: sheet.name,
              matches: [],
              error: err.message
            };
          }
        })
      );

      res.json({
        success: true,
        tournaments,
        importedAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Import error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Error al importar la planilla"
      });
    }
  });

  // Serve static files and handle Vite HMR in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();

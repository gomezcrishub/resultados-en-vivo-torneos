import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Download, 
  Calendar, 
  Trophy, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  Info, 
  User, 
  Clock, 
  Award, 
  Sparkles,
  Zap,
  Activity,
  AlertCircle
} from "lucide-react";
import { Match, Standing, Tournament } from "./types";

const GOOGLE_SHEETS_URL = "https://docs.google.com/spreadsheets/d/1gEJPn4l5OIzl28Fj1DrF_KhrGRuIkKGBovap4PZpBbw/edit?usp=drivesdk";

const DEFAULT_TOURNAMENTS: Tournament[] = [
  {
    id: "torneo-masc-a",
    name: "MASCULINO A",
    matches: [
      {
        id: "m-a-1",
        grupo: "A",
        pareja1: "Federico Chingotto - Alejandro Galán",
        pareja2: "Martin Di Nenno - Franco Stupaczuk",
        gamePareja1: 2,
        gamePareja2: 1,
        juegosPareja1: 15,
        juegosPareja2: 12,
        estado: "Jugado",
        set1: "6-4",
        set2: "3-6",
        set3: "6-2"
      },
      {
        id: "m-a-2",
        grupo: "A",
        pareja1: "Juan Lebrón - Francisco Navarro",
        pareja2: "Fernando Belasteguín - Sanyo Gutiérrez",
        gamePareja1: 2,
        gamePareja2: 0,
        juegosPareja1: 12,
        juegosPareja2: 7,
        estado: "Jugado",
        set1: "6-3",
        set2: "6-4"
      },
      {
        id: "m-a-3",
        grupo: "B",
        pareja1: "Agustín Tapia - Arturo Coello",
        pareja2: "Jon Sanz - Coki Nieto",
        gamePareja1: null,
        gamePareja2: null,
        estado: "Pendiente"
      },
      {
        id: "m-a-4",
        grupo: "B",
        pareja1: "Fernando Belasteguín - Sanyo Gutiérrez",
        pareja2: "Jon Sanz - Coki Nieto",
        gamePareja1: 0,
        gamePareja2: 2,
        juegosPareja1: 5,
        juegosPareja2: 12,
        estado: "Jugado",
        set1: "1-6",
        set2: "4-6"
      }
    ]
  },
  {
    id: "torneo-fem-a",
    name: "FEMENINO B",
    matches: [
      {
        id: "f-b-1",
        grupo: "A",
        pareja1: "Gemma Triay - Claudia Fernández",
        pareja2: "Delfina Brea - Bea González",
        gamePareja1: 2,
        gamePareja2: 0,
        juegosPareja1: 13,
        juegosPareja2: 9,
        estado: "Jugado",
        set1: "6-4",
        set2: "7-5"
      },
      {
        id: "f-b-2",
        grupo: "A",
        pareja1: "Ariana Sánchez - Paula Josemaría",
        pareja2: "Alejandra Salazar - Jessica Castelló",
        gamePareja1: null,
        gamePareja2: null,
        estado: "Pendiente"
      }
    ]
  }
];

const DEFAULT_PLAYOFFS = {
  octavos: [
    { id: "o-1", grupo: "Octavos", pareja1: "A. Tapia - A. Coello", pareja2: "F. Belasteguín - S. Gutiérrez", gamePareja1: 2, gamePareja2: 0, estado: "Jugado" as const },
    { id: "o-2", grupo: "Octavos", pareja1: "J. Lebrón - P. Cardona", pareja2: "J. Sanz - C. Nieto", gamePareja1: 1, gamePareja2: 2, estado: "Jugado" as const },
    { id: "o-3", grupo: "Octavos", pareja1: "F. Chingotto - A. Galán", pareja2: "L. Campagnolo - J. Leal", gamePareja1: 2, gamePareja2: 0, estado: "Jugado" as const },
    { id: "o-4", grupo: "Octavos", pareja1: "M. Di Nenno - F. Stupaczuk", pareja2: "M. Yanguas - J. Garrido", gamePareja1: 2, gamePareja2: 1, estado: "Jugado" as const },
    { id: "o-5", grupo: "Octavos", pareja1: "P. Lima - A. Ruiz", pareja2: "V. Ruiz - L. Bergamini", gamePareja1: 2, gamePareja2: 0, estado: "Jugado" as const },
    { id: "o-6", grupo: "Octavos", pareja1: "C. Gutiérrez - L. Capra", pareja2: "J. Rico - G. Coki", gamePareja1: null, gamePareja2: null, estado: "Pendiente" as const },
    { id: "o-7", grupo: "Octavos", pareja1: "J. Tello - F. Navarro", pareja2: "E. Alonso - A. Arroyo", gamePareja1: null, gamePareja2: null, estado: "Pendiente" as const },
    { id: "o-8", grupo: "Octavos", pareja1: "M. Semmler - P. Lijó", pareja2: "T. Zapata - F. Guerrero", gamePareja1: null, gamePareja2: null, estado: "Pendiente" as const }
  ],
  cuartos: [
    { id: "c-1", grupo: "Cuartos", pareja1: "A. Tapia - A. Coello", pareja2: "J. Sanz - C. Nieto", gamePareja1: null, gamePareja2: null, estado: "Pendiente" as const },
    { id: "c-2", grupo: "Cuartos", pareja1: "F. Chingotto - A. Galán", pareja2: "M. Di Nenno - F. Stupaczuk", gamePareja1: null, gamePareja2: null, estado: "Pendiente" as const },
    { id: "c-3", grupo: "Cuartos", pareja1: "P. Lima - A. Ruiz", pareja2: "Ganador Octavos 6", gamePareja1: null, gamePareja2: null, estado: "Pendiente" as const },
    { id: "c-4", grupo: "Cuartos", pareja1: "Ganador Octavos 7", pareja2: "Ganador Octavos 8", gamePareja1: null, gamePareja2: null, estado: "Pendiente" as const }
  ],
  semifinal: [
    { id: "s-1", grupo: "Semifinal", pareja1: "Ganador Cuartos 1", pareja2: "Ganador Cuartos 2", gamePareja1: null, gamePareja2: null, estado: "Pendiente" as const },
    { id: "s-2", grupo: "Semifinal", pareja1: "Ganador Cuartos 3", pareja2: "Ganador Cuartos 4", gamePareja1: null, gamePareja2: null, estado: "Pendiente" as const }
  ],
  final: [
    { id: "f-1", grupo: "Final", pareja1: "Ganador Semifinal 1", pareja2: "Ganador Semifinal 2", gamePareja1: null, gamePareja2: null, estado: "Pendiente" as const }
  ]
};

export default function App() {
  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem("padel_tournaments");
    return saved ? JSON.parse(saved) : DEFAULT_TOURNAMENTS;
  });

  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(() => {
    return localStorage.getItem("padel_selected_tournament_id") || null;
  });

  const [loading, setLoading] = useState(false);
  const [lastImport, setLastImport] = useState<string | null>(() => {
    return localStorage.getItem("padel_last_import") || "Valores iniciales";
  });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<"TABLA" | "PARTIDOS" | "PLAYOFFS">("TABLA");

  // Save tournaments to localStorage
  const saveToStorage = (data: Tournament[], timeStr: string) => {
    localStorage.setItem("padel_tournaments", JSON.stringify(data));
    localStorage.setItem("padel_last_import", timeStr);
  };

  const handleImport = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const response = await fetch("/api/import");
      const data = await response.json();
      if (data.success && data.tournaments) {
        setTournaments(data.tournaments);
        const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + " (Hoy)";
        setLastImport(timeFormatted);
        saveToStorage(data.tournaments, timeFormatted);
        localStorage.setItem("padel_has_imported", "true");
        setSuccessMsg("¡Planilla de Google Sheets sincronizada con éxito!");
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        throw new Error(data.error || "La respuesta de la planilla no fue exitosa.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Error al conectar con la API de Google Sheets: ${err.message || "Por favor intente nuevamente."}`);
    } finally {
      setLoading(false);
    }
  };

  // Silent auto-import on mount if never imported before
  useEffect(() => {
    const hasImportedBefore = localStorage.getItem("padel_has_imported") === "true";
    if (!hasImportedBefore) {
      // Execute silent background import to feed fresh data from public link
      handleImport();
    }
  }, []);

  const handleSelectTournament = (id: string | null) => {
    setSelectedTournamentId(id);
    if (id) {
      localStorage.setItem("padel_selected_tournament_id", id);
    } else {
      localStorage.removeItem("padel_selected_tournament_id");
    }
  };

  // Reset to DEFAULT_TOURNAMENTS
  const handleReset = () => {
    if (window.confirm("¿Seguro que deseas restablecer los datos al estado por defecto?")) {
      setTournaments(DEFAULT_TOURNAMENTS);
      setSelectedTournamentId(null);
      setLastImport("Valores iniciales");
      localStorage.removeItem("padel_tournaments");
      localStorage.removeItem("padel_selected_tournament_id");
      localStorage.removeItem("padel_last_import");
      localStorage.removeItem("padel_has_imported");
      setSuccessMsg("Se restablecieron los datos iniciales.");
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const selectedTournament = useMemo(() => {
    if (!tournaments || tournaments.length === 0) return null;
    return tournaments.find(t => t.id === selectedTournamentId) || null;
  }, [tournaments, selectedTournamentId]);

  const matches = useMemo(() => {
    return selectedTournament ? selectedTournament.matches : [];
  }, [selectedTournament]);

  // Filter matches belonging only to Group Stage (e.g. group name is not Octavos, Cuartos, Semifinal, Final or longer text)
  const groupStageMatchesOnly = useMemo(() => {
    return matches.filter(m => {
      const g = m.grupo.toLowerCase();
      return !g.includes("octavo") && !g.includes("cuarto") && !g.includes("semi") && !g.includes("final") && g.length <= 2;
    });
  }, [matches]);

  // Compute standings per group dynamically based on current matches
  const standings = useMemo(() => {
    const standingsMap: Record<string, Record<string, Standing>> = {};

    groupStageMatchesOnly.forEach(m => {
      const { grupo, pareja1, pareja2, gamePareja1, gamePareja2, estado } = m;
      if (!standingsMap[grupo]) {
        standingsMap[grupo] = {};
      }
      
      [pareja1, pareja2].forEach(p => {
        if (!standingsMap[grupo][p]) {
          standingsMap[grupo][p] = {
            pareja: p,
            grupo,
            jugados: 0,
            ganados: 0,
            perdidos: 0,
            gamesAFavor: 0,
            gamesEnContra: 0,
            difGames: 0
          };
        }
      });

      if (estado === "Jugado" && gamePareja1 !== null && gamePareja2 !== null) {
        const stats1 = standingsMap[grupo][pareja1];
        const stats2 = standingsMap[grupo][pareja2];

        stats1.jugados += 1;
        stats2.jugados += 1;

        // Use precise games won/lost from sets if present, otherwise fallback to matches won (legacy format)
        const g1 = m.juegosPareja1 !== undefined ? m.juegosPareja1 : gamePareja1;
        const g2 = m.juegosPareja2 !== undefined ? m.juegosPareja2 : gamePareja2;

        stats1.gamesAFavor += g1;
        stats1.gamesEnContra += g2;

        stats2.gamesAFavor += g2;
        stats2.gamesEnContra += g1;

        if (gamePareja1 > gamePareja2) {
          stats1.ganados += 1;
          stats2.perdidos += 1;
        } else if (gamePareja1 < gamePareja2) {
          stats2.ganados += 1;
          stats1.perdidos += 1;
        }
      }
    });

    const result: Record<string, Standing[]> = {};
    Object.keys(standingsMap).forEach(grupo => {
      result[grupo] = Object.values(standingsMap[grupo]).map(item => ({
        ...item,
        difGames: item.gamesAFavor - item.gamesEnContra
      })).sort((a, b) => {
        // Tie-break standard sorting: Wins -> Game Diff -> Games For (Favor) -> Name
        if (b.ganados !== a.ganados) return b.ganados - a.ganados;
        if (b.difGames !== a.difGames) return b.difGames - a.difGames;
        if (b.gamesAFavor !== a.gamesAFavor) return b.gamesAFavor - a.gamesAFavor;
        return a.pareja.localeCompare(b.pareja);
      });
    });

    return result;
  }, [groupStageMatchesOnly]);

  // Statistics summaries
  const stats = useMemo(() => {
    const total = groupStageMatchesOnly.length;
    const played = groupStageMatchesOnly.filter(m => m.estado === "Jugado").length;
    const pending = total - played;
    const totalGames = groupStageMatchesOnly.reduce((acc, current) => {
      return acc + (current.gamePareja1 || 0) + (current.gamePareja2 || 0);
    }, 0);
    return { total, played, pending, totalGames };
  }, [groupStageMatchesOnly]);

  // Group matches by group (A, B, etc.)
  const groupedMatches = useMemo(() => {
    const groups: Record<string, Match[]> = {};
    groupStageMatchesOnly.forEach(m => {
      const gName = m.grupo.toUpperCase();
      if (!groups[gName]) {
        groups[gName] = [];
      }
      groups[gName].push(m);
    });
    return Object.keys(groups).sort().map(gKey => ({
      groupName: `GRUPO ${gKey}`,
      list: groups[gKey]
    }));
  }, [groupStageMatchesOnly]);

  // Playoff categorized structures
  const playoffRounds = useMemo(() => {
    const octavosM = matches.filter(m => m.grupo.toLowerCase().includes("octavo"));
    const cuartosM = matches.filter(m => m.grupo.toLowerCase().includes("cuarto"));
    const semifinalM = matches.filter(m => m.grupo.toLowerCase().includes("semi"));
    const finalM = matches.filter(m => m.grupo.toLowerCase().includes("final") && !m.grupo.toLowerCase().includes("cuarto") && !m.grupo.toLowerCase().includes("semi"));

    return {
      octavos: octavosM.length > 0 ? octavosM : DEFAULT_PLAYOFFS.octavos,
      cuartos: cuartosM.length > 0 ? cuartosM : DEFAULT_PLAYOFFS.cuartos,
      semifinal: semifinalM.length > 0 ? semifinalM : DEFAULT_PLAYOFFS.semifinal,
      final: finalM.length > 0 ? finalM : DEFAULT_PLAYOFFS.final
    };
  }, [matches]);

  const renderParejaName = (name: string | undefined | null, isWhiteTextBg: boolean = false) => {
    const clean = name ? name.trim() : "";
    if (!clean) {
      return (
        <span className={`italic font-mono text-[9px] font-normal lowercase tracking-wide ${isWhiteTextBg ? "text-zinc-400" : "text-zinc-500"}`}>
          a confirmar
        </span>
      );
    }
    return <>{clean}</>;
  };

  const renderSetScoresJSX = (matchItem: Match, isPareja1: boolean, isPlayoffCard: boolean = false) => {
    const isPlayed = matchItem.estado === "Jugado";
    if (!isPlayed) {
      return (
        <span className="text-zinc-400 text-xs italic opacity-60 font-mono">—</span>
      );
    }

    const sets = [matchItem.set1, matchItem.set2, matchItem.set3].filter(Boolean) as string[];
    let parsedSets: { g1: number; g2: number }[] = [];

    if (sets.length > 0) {
      parsedSets = sets.map(setStr => {
        const clean = setStr.trim();
        const parts = clean.split(/[-/\x20]+/).map(s => s.trim()).filter(Boolean);
        if (parts.length >= 2) {
          const g1 = parseInt(parts[0], 10);
          const g2 = parseInt(parts[1], 10);
          return {
            g1: isNaN(g1) ? 0 : g1,
            g2: isNaN(g2) ? 0 : g2
          };
        }
        return { g1: 0, g2: 0 };
      });
    } else {
      if (matchItem.gamePareja1 !== null && matchItem.gamePareja2 !== null) {
        parsedSets = [{ g1: matchItem.gamePareja1, g2: matchItem.gamePareja2 }];
      }
    }

    if (parsedSets.length === 0) {
      return <span className="text-zinc-400 text-xs italic opacity-60 font-mono">—</span>;
    }

    return (
      <div className="flex items-center gap-1 font-mono shrink-0">
        {parsedSets.map((s, idx) => {
          const playerGames = isPareja1 ? s.g1 : s.g2;
          const opponentGames = isPareja1 ? s.g2 : s.g1;
          const isSetWinner = playerGames > opponentGames;
          
          let boxClass = "";
          if (isPlayoffCard) {
            boxClass = isSetWinner
              ? "w-[21px] h-[21px] text-[13.5px] font-black bg-red-650 text-white flex items-center justify-center font-mono rounded-none"
              : "w-[21px] h-[21px] text-[13.5px] font-medium bg-white/10 text-zinc-300 flex items-center justify-center font-mono rounded-none border border-white/5";
          } else {
            boxClass = isSetWinner
              ? "w-[27px] h-[27px] text-[15.5px] font-black bg-red-650 text-white flex items-center justify-center font-mono rounded-none"
              : "w-[27px] h-[27px] text-[15.5px] font-semibold bg-white/15 text-zinc-200 flex items-center justify-center font-mono rounded-none border border-white/5";
          }

          return (
            <span key={idx} className={boxClass}>
              {playerGames}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] selection:bg-red-600 selection:text-white font-sans relative">
      {/* Editorial Watermark Grid Background Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(26,26,26,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-12 pt-3 sm:pt-5 pb-10 relative z-10">
        
        {/* Header Block Section */}
        <header className="mb-5 border-b-2 border-[#1A1A1A] pb-3 flex flex-col gap-3" id="app-header">
          
          <div className="w-full">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[4.2rem] xl:text-[5.2rem] font-black font-display tracking-tighter leading-none uppercase text-[#1A1A1A] w-full block break-all">
              PADELNUESTRO.SGO
            </h1>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-0">
            <p className="font-sans text-[11px] tracking-wider uppercase opacity-65 max-w-xl leading-relaxed">
              Resumen de partidos en vivo
            </p>

            {/* Action Hub and Link to Docs in Editorial style */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0" id="control-panel">
              <button
                onClick={handleImport}
                disabled={loading}
                className={`relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer ${
                  loading 
                    ? "bg-zinc-200 text-zinc-400 border border-zinc-300 cursor-not-allowed" 
                    : "bg-[#1A1A1A] hover:bg-red-600 text-white hover:shadow-[0_3px_10px_rgba(220,38,38,0.2)]"
                }`}
                id="btn-import-doc"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sincronizando...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Actualizar</span>
                  </>
                )}
              </button>
              
              {/* Reset helper */}
              {lastImport !== "Valores iniciales" && (
                <button 
                  onClick={handleReset}
                  className="p-2 rounded-full text-[#1A1A1A] hover:text-red-600 bg-zinc-100 hover:bg-zinc-200 transition-all duration-200"
                  title="Restablecer datos iniciales"
                  id="btn-reset"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Success / Error Notification Banners */}
        <AnimatePresence>
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-none bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-800 flex items-center gap-3"
              id="success-banner"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-[11px] font-bold uppercase tracking-wider">{successMsg}</div>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 rounded-none bg-red-500/5 border-l-4 border-red-600 text-red-950 flex items-start gap-4"
              id="error-banner"
            >
              <AlertCircle className="w-4 h-4 text-red-650 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#1A1A1A]">No se pudo realizar la sincronización</div>
                <div className="text-xs mt-1 leading-relaxed opacity-80">{errorMsg}</div>
                <div className="mt-2 text-[10px] text-[#1A1A1A] bg-white border border-[#1A1A1A]/10 p-2.5">
                  <p className="font-bold uppercase tracking-wider mb-0.5">Nota del sistema:</p>
                  <p className="mb-1 opacity-80">El documento original no está accesible temporalmente. Puedes probar configurando el acceso público como &quot;Cualquier persona con el enlace&quot; en Google Drive.</p>
                  <p className="font-semibold text-red-600 font-mono">¡No te preocupes! El visualizador conserva el juego de datos por defecto para que explores la interfaz deportiva.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedTournamentId === null ? (
          /* TOURNAMENT / CATEGORY CARD SELECTION GRID */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header info bar for Categories */}
            <div className="bg-[#FAF8F5] border-l-2 border-[#1A1A1A] p-4 text-xs text-[#1A1A1A] leading-relaxed flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-sans font-black uppercase text-red-650 tracking-wider block">Panel de Torneos & Categorías</span>
                <p className="opacity-75 mt-0.5">Selecciona uno de los torneos activos sincronizados desde la planilla de Google Sheets para visualizar clasificaciones, resultados en vivo y brackets de eliminatorias.</p>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 whitespace-nowrap bg-zinc-100 p-1.5 border border-zinc-200 uppercase tracking-widest leading-none self-start md:self-auto">
                Último canje: {lastImport}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((t) => {
                const total = t.matches?.length || 0;
                // Group stage matches only for stats inside card
                const groupMatchesOnly = t.matches?.filter(m => {
                  const g = m.grupo.toLowerCase();
                  return !g.includes("octavo") && !g.includes("cuarto") && !g.includes("semi") && !g.includes("final") && g.length <= 2;
                }) || [];
                const played = groupMatchesOnly.filter(m => m.estado === "Jugado").length;
                const progressPercent = groupMatchesOnly.length > 0 ? Math.round((played / groupMatchesOnly.length) * 100) : 0;
                
                // Get unique active groups
                const groups = Array.from(new Set(groupMatchesOnly.map(m => m.grupo.toUpperCase()))).sort();

                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTournament(t.id)}
                    className="group bg-[#FAF8F5] hover:bg-white text-left p-6 border-2 border-[#1A1A1A] rounded-none shadow-[4px_4px_0px_0px_#1A1A1A] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#1A1A1A] flex flex-col justify-between min-h-[220px] cursor-pointer"
                  >
                    <div className="space-y-3 w-full">
                      {/* Badge / Index card styling */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                          #{t.id.substring(0, 6)}
                        </span>
                        <span className="text-[9px] font-sans font-black bg-red-655 text-red-650 uppercase tracking-wider px-2 py-0.5 bg-red-50">
                          EN CURSO
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-md font-black font-display uppercase tracking-tight text-[#1A1A1A] group-hover:text-red-500 transition-colors">
                        {t.name}
                      </h3>

                      {/* Groups label badges */}
                      {groups.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {groups.map(g => (
                            <span key={g} className="text-[8px] font-mono font-bold bg-[#1A1A1A]/5 text-zinc-655 px-1.5 py-0.5 border border-[#1A1A1A]/5">
                              GRUPO {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Progress details */}
                    <div className="w-full space-y-2 pt-4 border-t border-[#1A1A1A]/5 mt-4">
                      <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                        <span>Fase de grupos: {played}/{groupMatchesOnly.length} jugados</span>
                        <span>{progressPercent}%</span>
                      </div>
                      
                      {/* Bar */}
                      <div className="w-full bg-[#1A1A1A]/5 h-1.5 rounded-none overflow-hidden">
                        <div 
                          className="bg-red-650 h-full transition-all duration-500" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-bold text-red-650 uppercase font-sans tracking-widest pt-1 shrink-0">
                        <span>Ver Estadísticas</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Disclaimer and spreadsheet description */}
            <div className="p-6 border border-dashed border-zinc-300 bg-[#FAF8F5]/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">Acerca de los datos</p>
                <p className="text-[11px] text-zinc-500 leading-relaxed max-w-2xl">
                  Cada tarjeta es extraída de una pestaña diferente en el Google Sheet oficial. Se sincronizan de forma directa las clasificaciones y resultados. Puedes agregar o editar pestañas para poblar nuevas categorías deportivas en tiempo real.
                </p>
              </div>
              <a 
                href={GOOGLE_SHEETS_URL}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-zinc-150 hover:bg-[#1A1A1A] hover:text-white text-zinc-600 border border-[#1A1A1A]/10 text-[10px] font-bold uppercase tracking-widest transition-all shrink-0"
              >
                Abrir Sheet de Google ↗
              </a>
            </div>
          </motion.div>
        ) : (
          /* IF TOURNAMENT IS SELECTED: SHOW ACTIVE TOURNAMENT VIEWS (TABLA, PARTIDOS, PLAYOFFS) */
          <>
            {/* Breadcrumbs / Navigation and back action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <button
                onClick={() => handleSelectTournament(null)}
                className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-widest text-zinc-700 hover:text-white bg-zinc-100 hover:bg-[#1A1A1A] border-2 border-[#1A1A1A] transition-all cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#1A1A1A]"
              >
                <span>← Volver a Torneos</span>
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Estás viendo:</span>
                <span className="text-xs font-black font-display uppercase tracking-wider text-red-650 bg-red-50 border border-red-200 px-2 py-0.5">
                  {selectedTournament?.name}
                </span>
              </div>
            </div>

            {/* Quick Numerical Stats Dashboard Row - extremely compact and side-by-side */}
            <section className="grid grid-cols-2 gap-3 mb-5 max-w-xs" id="statistics-dashboard">
              <div className="bg-[#FAF8F5] border border-[#1A1A1A]/10 rounded-none px-2 py-1 flex items-center justify-between">
                <div className="text-[8px] uppercase tracking-wider font-extrabold text-red-600">JUGADOS</div>
                <span className="text-lg font-black font-display italic text-[#1A1A1A] leading-none">{stats.played}</span>
              </div>

              <div className="bg-[#FAF8F5] border border-[#1A1A1A]/10 rounded-none px-2 py-1 flex items-center justify-between">
                <div className="text-[8px] uppercase tracking-wider font-extrabold opacity-70">PENDIENTES</div>
                <span className="text-lg font-black font-display italic text-red-650 leading-none">{stats.pending}</span>
              </div>
            </section>

            {/* Navigation Tabs - Editorial Grid style */}
            <div className="flex border-2 border-[#1A1A1A] mb-6 text-center font-mono font-bold text-[10px] sm:text-xs uppercase" id="tab-navigation">
              <button
                onClick={() => setActiveTab("TABLA")}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2.5 px-1 tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === "TABLA"
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-transparent text-[#1A1A1A] hover:bg-zinc-100"
                }`}
              >
                <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">Clasificados</span>
              </button>
              <button
                onClick={() => setActiveTab("PARTIDOS")}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2.5 px-1 tracking-wider transition-all duration-200 border-l-2 border-[#1A1A1A] cursor-pointer ${
                  activeTab === "PARTIDOS"
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-transparent text-[#1A1A1A] hover:bg-zinc-100"
                }`}
              >
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">Resultados</span>
              </button>
              <button
                onClick={() => setActiveTab("PLAYOFFS")}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2.5 px-1 tracking-wider transition-all duration-200 border-l-2 border-[#1A1A1A] cursor-pointer ${
                  activeTab === "PLAYOFFS"
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-transparent text-[#1A1A1A] hover:bg-zinc-100"
                }`}
              >
                <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">Playoffs</span>
              </button>
            </div>

            {/* Column layout wrapped with dynamic view handling */}
            <div className={`w-full mx-auto transition-all duration-300 ${activeTab === "PLAYOFFS" ? "max-w-7xl" : "max-w-4xl"}`}>
          
          {/* LEFT COLUMN: Classification / Standings */}
          {activeTab === "TABLA" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <section className="space-y-8" id="standings-section">
            <div className="bg-[#FAF8F5] border border-[#1A1A1A]/10 p-3 sm:p-6 rounded-none">
              <div className="flex items-center justify-between mb-6 border-b border-[#1A1A1A] pb-3">
                <h2 className="text-xl font-black font-display uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-600" /> CLASIFICACIÓN
                </h2>
              </div>

              {Object.keys(standings).length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs italic">
                  Sin estadísticas disponibles. Sincroniza datos para actualizar.
                </div>
              ) : (
                <div className="space-y-10">
                  {Object.keys(standings).sort().map(grupoName => (
                    <div key={grupoName} className="space-y-3" id={`group-box-${grupoName}`}>
                      <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-1.5">
                        <span className="text-sm font-black font-display uppercase tracking-tighter text-[#1A1A1A]">GRUPO {grupoName}</span>
                        <span className="text-[10px] font-mono text-zinc-500">({standings[grupoName].length} parejas disputando)</span>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-[#1A1A1A]/20 text-[9px] uppercase font-bold text-zinc-500 tracking-wider font-mono">
                              <th className="py-2 px-1 text-center w-8">RANK</th>
                              <th className="py-2 px-2">PAREJA / ATLETAS</th>
                              <th className="py-2 px-1.5 text-center" title="Partidos Jugados">PJ</th>
                              <th className="py-2 px-1.5 text-center text-red-600" title="Partidos Ganados">PG</th>
                              <th className="py-2 px-1.5 text-center text-black font-bold" title="Diferencia de Games">DF</th>
                              <th className="py-2 px-2 text-center text-zinc-500" title="Games a favor : en contra">PTS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1A1A1A]/5 text-xs">
                            {standings[grupoName].map((standingItem, idx) => {
                              const isTop2 = idx < 2;
                              return (
                                <tr 
                                  key={standingItem.pareja} 
                                  className={`hover:bg-[#1A1A1A]/2 transition-colors ${
                                    isTop2 ? "bg-red-500/[0.01]" : ""
                                  }`}
                                >
                                  <td className="py-2.5 px-1 text-center font-serif font-bold italic text-sm">
                                    {idx + 1}.
                                  </td>
                                  <td className="py-3 px-2 font-semibold text-[#1A1A1A] tracking-tight leading-tight uppercase text-[11px]">
                                    {standingItem.pareja}
                                  </td>
                                  <td className="py-2.5 px-1.5 text-center font-mono text-zinc-650">{standingItem.jugados}</td>
                                  <td className="py-2.5 px-1.5 text-center font-mono text-red-600 font-bold">{standingItem.ganados}</td>
                                  <td className={`py-2.5 px-1.5 text-center font-mono font-bold ${
                                    standingItem.difGames > 0 
                                      ? "text-emerald-700" 
                                      : standingItem.difGames < 0 
                                        ? "text-red-700" 
                                        : "text-zinc-500"
                                  }`}>
                                    {standingItem.difGames > 0 ? `+${standingItem.difGames}` : standingItem.difGames}
                                  </td>
                                  <td className="py-2.5 px-2 text-center font-mono text-[10px] text-zinc-500 whitespace-nowrap">
                                    {standingItem.gamesAFavor}:{standingItem.gamesEnContra}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Table details disclaimer info box */}
              <div className="mt-6 p-4 rounded-none bg-white border border-[#1A1A1A]/10 text-[11px] text-zinc-650 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-red-605 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Sistema de desempate manual reglamentario: <strong className="text-[#1A1A1A]">Partidos Ganados (PG)</strong> primero, seguidos de la <strong className="text-[#1A1A1A]">Diferencia de Games directos (DF)</strong>, y en última instancia el mayor número de <strong className="text-[#1A1A1A]">colocación a favor</strong>.
                </p>
              </div>
            </div>
          </section>
        </motion.div>
      )}

      {/* RIGHT COLUMN: Matches Feed */}
      {activeTab === "PARTIDOS" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <section className="space-y-6" id="matches-section">
            
            {/* Total Results Feed Counter */}
            <div className="bg-[#FAF8F5] border-l-2 border-red-650 p-3 text-[11px] text-[#1A1A1A] leading-relaxed">
              <span className="font-bold block uppercase text-red-650 tracking-wider mb-0.5">Reglamento Fase de Grupos</span>
              <p className="opacity-80">En grupos de 3, juegan todos vs todos, clasifican mejores 2. En grupos de 4, cada pareja juega 2 partidos (1vs2 y 3vs4, luego ganadores vs perdedores).</p>
            </div>

            {/* List and Feed representing matches */}
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {groupedMatches.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-16 text-center rounded-none bg-[#FAF8F5] border border-dashed border-[#1A1A1A]/15 text-zinc-500"
                  >
                    <p className="text-xs uppercase tracking-wider font-bold mb-1">No hay partidos cargados</p>
                  </motion.div>
                ) : (
                  groupedMatches.map((group, groupIndex) => (
                    <motion.div
                      key={group.groupName}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: groupIndex * 0.05 }}
                      className="bg-[#FAF8F5] p-5 rounded-none border border-[#1A1A1A]/10 space-y-4 shadow-[3px_3px_0px_0px_#1A1A1A]"
                      id={`group-card-${group.groupName.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      {/* Header of the Group General Card */}
                      <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-red-650 inline-block"></span>
                          <h3 className="text-[13px] font-black font-mono tracking-widest uppercase text-[#1A1A1A]">
                            {group.groupName}
                          </h3>
                        </div>
                      </div>

                      {/* Grid structure for the matches in this group */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {group.list.map((matchItem) => {
                          const isPlayed = matchItem.estado === "Jugado";
                          const isWinnerP1 = isPlayed && (matchItem.gamePareja1 || 0) > (matchItem.gamePareja2 || 0);
                          const isWinnerP2 = isPlayed && (matchItem.gamePareja2 || 0) > (matchItem.gamePareja1 || 0);

                          return (
                            <div
                              key={matchItem.id}
                              className={`overflow-hidden rounded-none border transition-all duration-300 relative group flex flex-col justify-between ${
                                isPlayed 
                                  ? "bg-[#1A1A1A] text-white border-transparent" 
                                  : "bg-[#FDFCFB]/90 text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30"
                              }`}
                              id={`match-card-${matchItem.id}`}
                            >
                              {/* Status bar segment for pending items */}
                              {!isPlayed && <div className="h-0.5 w-full bg-amber-500/20" />}

                              {/* Card Interior Padding - Compacter but clean */}
                              <div className="p-3">
                                
                                {/* Card Header (Meta Details) - Sleek and low margin */}
                                <div className="flex items-center justify-between gap-2 mb-2 text-[8px] font-bold uppercase tracking-widest font-mono opacity-80">
                                  <span className="tracking-tighter opacity-60">ID: #{matchItem.id.substring(0, 8)}</span>
                                  <div>
                                    {isPlayed ? (
                                      <span className="inline-flex items-center px-1.5 py-0.5 bg-red-650 text-white text-[7px] font-black uppercase tracking-widest">
                                        Jugado
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-1.5 py-0.5 border border-[#1A1A1A]/20 text-[#1A1A1A]/85 text-[7px] font-black uppercase tracking-widest">
                                        Pendiente
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Contestants Duel List - Tight spacing, full text wrapping */}
                                <div className="space-y-1.5">
                                  
                                  {/* Participant Row 1 */}
                                  <div className={`flex items-center justify-between rounded-none p-1.5 transition-all duration-200 ${
                                    isPlayed 
                                      ? isWinnerP1 
                                        ? "bg-white/5 text-white" 
                                        : "opacity-40"
                                      : "bg-zinc-50 border border-[#1A1A1A]/5"
                                  }`}>
                                    <div className="flex items-center gap-1.5 pr-2 flex-1 min-w-0">
                                      <User className={`w-3 h-3 shrink-0 ${isWinnerP1 ? "text-red-500" : "opacity-65"}`} />
                                      <span className={`text-[11px] tracking-tight whitespace-normal break-words leading-tight uppercase flex-1 ${isWinnerP1 ? "font-black" : "font-semibold"}`}>
                                        {renderParejaName(matchItem.pareja1, isPlayed)}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-end px-1 shrink-0">
                                      {renderSetScoresJSX(matchItem, true)}
                                    </div>
                                  </div>

                                  {/* Separator */}
                                  <div className="flex items-center gap-2 justify-center py-0.5 text-[7px] font-bold uppercase tracking-widest opacity-25 font-mono">
                                    <span className={`h-[1px] flex-1 ${isPlayed ? "bg-white/10" : "bg-black/10"}`}></span>
                                    <span>vs</span>
                                    <span className={`h-[1px] flex-1 ${isPlayed ? "bg-white/10" : "bg-black/10"}`}></span>
                                  </div>

                                  {/* Participant Row 2 */}
                                  <div className={`flex items-center justify-between rounded-none p-1.5 transition-all duration-200 ${
                                    isPlayed 
                                      ? isWinnerP2 
                                        ? "bg-white/5 text-white" 
                                        : "opacity-40"
                                      : "bg-zinc-50 border border-[#1A1A1A]/5"
                                  }`}>
                                    <div className="flex items-center gap-1.5 pr-2 flex-1 min-w-0">
                                      <User className={`w-3 h-3 shrink-0 ${isWinnerP2 ? "text-red-500" : "opacity-65"}`} />
                                      <span className={`text-[11px] tracking-tight whitespace-normal break-words leading-tight uppercase flex-1 ${isWinnerP2 ? "font-black" : "font-semibold"}`}>
                                        {renderParejaName(matchItem.pareja2, isPlayed)}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-end px-1 shrink-0">
                                      {renderSetScoresJSX(matchItem, false)}
                                    </div>
                                  </div>
                                  
                                </div>
                                
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>
        </motion.div>
      )}

      {/* PLAYOFFS COLUMN: Visual Bracket Tree */}
      {activeTab === "PLAYOFFS" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Header of Playoffs Section */}
          <div className="bg-[#FAF8F5] border-l-2 border-red-650 p-3.5 text-[11px] text-[#1A1A1A] leading-relaxed flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span className="font-bold block uppercase text-red-650 tracking-wider mb-0.5">Cuadro de Eliminatorias (Playoffs)</span>
              <p className="opacity-80">Rondas eliminatorias directas. Los resultados y clasificados se sincronizan en tiempo real.</p>
            </div>
            <div className="text-[10px] bg-[#1A1A1A]/5 px-2 py-1 border border-[#1A1A1A]/10 text-zinc-500 uppercase tracking-wider font-mono shrink-0">
              Desliza horizontalmente para ver la llave completa ↔
            </div>
          </div>

          {/* Premium Tournament Bracket Board */}
          <div className="w-full overflow-x-auto pb-4 pt-1 select-none" id="playoffs-bracket-board">
            <div className="flex gap-6 md:gap-10 min-w-[1050px] md:min-w-[1150px] h-[640px]">
              
              {/* Octavos de Final (Round of 16) Column */}
              <div className="flex-1 flex flex-col justify-between h-full bg-[#FAF8F5]/30 p-2 border border-[#1A1A1A]/5">
                <div className="text-center bg-[#1A1A1A] text-white py-1.5 px-3 text-[10px] font-black tracking-widest uppercase mb-1 font-mono">
                  Octavos de Final
                </div>
                <div className="flex-1 flex flex-col justify-around py-2">
                  {playoffRounds.octavos.map((matchItem, idx) => {
                    const isPlayed = matchItem.estado === "Jugado";
                    const isWinnerP1 = isPlayed && (matchItem.gamePareja1 || 0) > (matchItem.gamePareja2 || 0);
                    const isWinnerP2 = isPlayed && (matchItem.gamePareja2 || 0) > (matchItem.gamePareja1 || 0);
                    return (
                      <div 
                        key={matchItem.id} 
                        className={`rounded-none border p-2 transition-all duration-300 shadow-[1px_1px_3px_rgba(0,0,0,0.02)] ${
                          isPlayed 
                            ? "bg-[#1A1A1A] text-white border-transparent" 
                            : "bg-[#FAF8F5]/90 text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 text-[7px] font-bold font-mono tracking-wider opacity-60">
                          <span>OCTAVOS #{idx + 1}</span>
                          <span>{isPlayed ? "JUGADO" : "PENDIENTE"}</span>
                        </div>
                        <div className="space-y-1">
                          {/* Player 1 Row */}
                          <div className={`flex items-center justify-between px-1 py-0.5 rounded-none text-[10px] uppercase ${
                            isPlayed 
                              ? isWinnerP1 
                                ? "font-black text-white" 
                                : "opacity-35 text-white"
                              : "bg-white/85 border border-[#1A1A1A]/5 font-semibold"
                          }`}>
                            <span className="truncate pr-1.5">{renderParejaName(matchItem.pareja1, isPlayed)}</span>
                            {renderSetScoresJSX(matchItem, true, true)}
                          </div>
                          {/* Player 2 Row */}
                          <div className={`flex items-center justify-between px-1 py-0.5 rounded-none text-[10px] uppercase ${
                            isPlayed 
                              ? isWinnerP2 
                                ? "font-black text-white" 
                                : "opacity-35 text-white"
                              : "bg-white/85 border border-[#1A1A1A]/5 font-semibold"
                          }`}>
                            <span className="truncate pr-1.5">{renderParejaName(matchItem.pareja2, isPlayed)}</span>
                            {renderSetScoresJSX(matchItem, false, true)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cuartos de Final (Quarterfinals) Column */}
              <div className="flex-1 flex flex-col justify-between h-full bg-[#FAF8F5]/30 p-2 border border-[#1A1A1A]/5">
                <div className="text-center bg-[#1A1A1A] text-white py-1.5 px-3 text-[10px] font-black tracking-widest uppercase mb-1 font-mono">
                  Cuartos de Final
                </div>
                <div className="flex-1 flex flex-col justify-around py-2">
                  {playoffRounds.cuartos.map((matchItem, idx) => {
                    const isPlayed = matchItem.estado === "Jugado";
                    const isWinnerP1 = isPlayed && (matchItem.gamePareja1 || 0) > (matchItem.gamePareja2 || 0);
                    const isWinnerP2 = isPlayed && (matchItem.gamePareja2 || 0) > (matchItem.gamePareja1 || 0);
                    return (
                      <div 
                        key={matchItem.id} 
                        className={`rounded-none border p-2 transition-all duration-300 shadow-[2px_2px_4px_rgba(0,0,0,0.03)] ${
                          isPlayed 
                            ? "bg-[#1A1A1A] text-white border-transparent" 
                            : "bg-[#FAF8F5]/90 text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 text-[7px] font-bold font-mono tracking-wider opacity-60">
                          <span>CUARTOS #{idx + 1}</span>
                          <span>{isPlayed ? "JUGADO" : "PENDIENTE"}</span>
                        </div>
                        <div className="space-y-1">
                          {/* Player 1 Row */}
                          <div className={`flex items-center justify-between px-1.5 py-0.5 rounded-none text-[10px] uppercase ${
                            isPlayed 
                              ? isWinnerP1 
                                ? "font-black text-white" 
                                : "opacity-35 text-white"
                              : "bg-white/85 border border-[#1A1A1A]/5 font-semibold"
                          }`}>
                            <span className="truncate pr-1.5">{renderParejaName(matchItem.pareja1, isPlayed)}</span>
                            {renderSetScoresJSX(matchItem, true, true)}
                          </div>
                          {/* Player 2 Row */}
                          <div className={`flex items-center justify-between px-1.5 py-0.5 rounded-none text-[10px] uppercase ${
                            isPlayed 
                              ? isWinnerP2 
                                ? "font-black text-white" 
                                : "opacity-35 text-white"
                              : "bg-white/85 border border-[#1A1A1A]/5 font-semibold"
                          }`}>
                            <span className="truncate pr-1.5">{renderParejaName(matchItem.pareja2, isPlayed)}</span>
                            {renderSetScoresJSX(matchItem, false, true)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Semifinales (Semifinals) Column */}
              <div className="flex-1 flex flex-col justify-between h-full bg-[#FAF8F5]/30 p-2 border border-[#1A1A1A]/5">
                <div className="text-center bg-[#1A1A1A] text-white py-1.5 px-3 text-[10px] font-black tracking-widest uppercase mb-1 font-mono">
                  Semifinales
                </div>
                <div className="flex-1 flex flex-col justify-around py-2">
                  {playoffRounds.semifinal.map((matchItem, idx) => {
                    const isPlayed = matchItem.estado === "Jugado";
                    const isWinnerP1 = isPlayed && (matchItem.gamePareja1 || 0) > (matchItem.gamePareja2 || 0);
                    const isWinnerP2 = isPlayed && (matchItem.gamePareja2 || 0) > (matchItem.gamePareja1 || 0);
                    return (
                      <div 
                        key={matchItem.id} 
                        className={`rounded-none border p-2 transition-all duration-300 shadow-[3px_3px_5px_rgba(0,0,0,0.04)] ${
                          isPlayed 
                            ? "bg-[#1A1A1A] text-white border-transparent" 
                            : "bg-[#FAF8F5]/90 text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 text-[7px] font-bold font-mono tracking-wider opacity-60">
                          <span>SEMIFINAL #{idx + 1}</span>
                          <span>{isPlayed ? "JUGADO" : "PENDIENTE"}</span>
                        </div>
                        <div className="space-y-1">
                          {/* Player 1 Row */}
                          <div className={`flex items-center justify-between px-1.5 py-0.5 rounded-none text-[10px] uppercase ${
                            isPlayed 
                              ? isWinnerP1 
                                ? "font-black text-white" 
                                : "opacity-35 text-white"
                              : "bg-white/85 border border-[#1A1A1A]/5 font-semibold"
                          }`}>
                            <span className="truncate pr-1.5">{renderParejaName(matchItem.pareja1, isPlayed)}</span>
                            {renderSetScoresJSX(matchItem, true, true)}
                          </div>
                          {/* Player 2 Row */}
                          <div className={`flex items-center justify-between px-1.5 py-0.5 rounded-none text-[10px] uppercase ${
                            isPlayed 
                              ? isWinnerP2 
                                ? "font-black text-white" 
                                : "opacity-35 text-white"
                              : "bg-white/85 border border-[#1A1A1A]/5 font-semibold"
                          }`}>
                            <span className="truncate pr-1.5">{renderParejaName(matchItem.pareja2, isPlayed)}</span>
                            {renderSetScoresJSX(matchItem, false, true)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gran Final (Finals) Column */}
              <div className="flex-1 flex flex-col justify-between h-full bg-[#FAF8F5]/30 p-2 border border-[#1A1A1A]/5">
                <div className="text-center bg-[#1A1A1A] text-white py-1.5 px-3 text-[10px] font-black tracking-widest uppercase mb-1 font-mono">
                  Gran Final
                </div>
                <div className="flex-1 flex flex-col justify-around py-2">
                  {playoffRounds.final.map((matchItem) => {
                    const isPlayed = matchItem.estado === "Jugado";
                    const isWinnerP1 = isPlayed && (matchItem.gamePareja1 || 0) > (matchItem.gamePareja2 || 0);
                    const isWinnerP2 = isPlayed && (matchItem.gamePareja2 || 0) > (matchItem.gamePareja1 || 0);
                    return (
                      <div 
                        key={matchItem.id} 
                        className={`rounded-none border-2 p-3 transition-all duration-300 shadow-[4px_4px_8px_rgba(0,0,0,0.06)] relative overflow-hidden ${
                          isPlayed 
                            ? "bg-[#1A1A1A] text-white border-transparent ring-2 ring-red-650" 
                            : "bg-[#FAF8F5]/90 text-[#1A1A1A] border-dashed border-red-650"
                        }`}
                      >
                        <div className="absolute top-0 right-0 bg-red-650 text-white text-[5px] font-black uppercase px-1.5 py-0.5 tracking-wider font-mono">
                          TROFEO
                        </div>
                        <div className="flex items-center justify-between mb-1.5 text-[7px] font-bold font-mono tracking-wider opacity-60">
                          <span>FINAL</span>
                          <span>{isPlayed ? "JUGADO" : "PENDIENTE"}</span>
                        </div>
                        <div className="space-y-1">
                          {/* Player 1 Row */}
                          <div className={`flex items-center justify-between px-1.5 py-1 rounded-none text-[10px] uppercase ${
                            isPlayed 
                              ? isWinnerP1 
                                ? "font-black text-red-500 text-[11px]" 
                                : "opacity-35 text-white"
                              : "bg-white/85 border border-[#1A1A1A]/5 font-bold"
                          }`}>
                            <span className="truncate pr-1.5">{renderParejaName(matchItem.pareja1, isPlayed)}</span>
                            {renderSetScoresJSX(matchItem, true, true)}
                          </div>
                          {/* Player 2 Row */}
                          <div className={`flex items-center justify-between px-1.5 py-1 rounded-none text-[10px] uppercase ${
                            isPlayed 
                              ? isWinnerP2 
                                ? "font-black text-red-500 text-[11px]" 
                                : "opacity-35 text-white"
                              : "bg-white/85 border border-[#1A1A1A]/5 font-bold"
                          }`}>
                            <span className="truncate pr-1.5">{renderParejaName(matchItem.pareja2, isPlayed)}</span>
                            {renderSetScoresJSX(matchItem, false, true)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      )}

        </div>
          </>
        )}
        
        {/* Humble, Professional Footer without clutter */}
        <footer className="mt-20 pt-10 border-t border-[#1A1A1A]/10 text-center text-zinc-500 text-xs">
          <p className="font-sans uppercase tracking-widest text-[9px] font-bold">&copy; {new Date().getFullYear()} I Torneo de Pádel _ Todos los derechos reservados. Edición Deportiva Especial.</p>
          <div className="mt-2 text-[9px] font-mono opacity-80">
            Enlace fuente de datos externa: <span className="text-[#1A1A1A] hover:text-red-650 transition-colors font-bold uppercase">{GOOGLE_SHEETS_URL.split('?')[0]}</span>
          </div>
        </footer>

      </div>
    </div>
  );
}

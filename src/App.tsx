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
  AlertCircle,
} from "lucide-react";
import { Match, Standing, Tournament } from "./types";

const GOOGLE_SHEETS_URL =
  "https://docs.google.com/spreadsheets/d/1gEJPn4l5OIzl28Fj1DrF_KhrGRuIkKGBovap4PZpBbw/edit?usp=drivesdk";

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
        set3: "6-2",
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
        set2: "6-4",
      },
      {
        id: "m-a-3",
        grupo: "B",
        pareja1: "Agustín Tapia - Arturo Coello",
        pareja2: "Jon Sanz - Coki Nieto",
        gamePareja1: null,
        gamePareja2: null,
        estado: "Pendiente",
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
        set2: "4-6",
      },
    ],
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
        set2: "7-5",
      },
      {
        id: "f-b-2",
        grupo: "A",
        pareja1: "Ariana Sánchez - Paula Josemaría",
        pareja2: "Alejandra Salazar - Jessica Castelló",
        gamePareja1: null,
        gamePareja2: null,
        estado: "Pendiente",
      },
    ],
  },
];

const DEFAULT_PLAYOFFS = {
  octavos: [
    {
      id: "o-1",
      grupo: "Octavos",
      pareja1: "A. Tapia - A. Coello",
      pareja2: "F. Belasteguín - S. Gutiérrez",
      gamePareja1: 2,
      gamePareja2: 0,
      estado: "Jugado" as const,
    },
    {
      id: "o-2",
      grupo: "Octavos",
      pareja1: "J. Lebrón - P. Cardona",
      pareja2: "J. Sanz - C. Nieto",
      gamePareja1: 1,
      gamePareja2: 2,
      estado: "Jugado" as const,
    },
    {
      id: "o-3",
      grupo: "Octavos",
      pareja1: "F. Chingotto - A. Galán",
      pareja2: "L. Campagnolo - J. Leal",
      gamePareja1: 2,
      gamePareja2: 0,
      estado: "Jugado" as const,
    },
    {
      id: "o-4",
      grupo: "Octavos",
      pareja1: "M. Di Nenno - F. Stupaczuk",
      pareja2: "M. Yanguas - J. Garrido",
      gamePareja1: 2,
      gamePareja2: 1,
      estado: "Jugado" as const,
    },
    {
      id: "o-5",
      grupo: "Octavos",
      pareja1: "P. Lima - A. Ruiz",
      pareja2: "V. Ruiz - L. Bergamini",
      gamePareja1: 2,
      gamePareja2: 0,
      estado: "Jugado" as const,
    },
    {
      id: "o-6",
      grupo: "Octavos",
      pareja1: "C. Gutiérrez - L. Capra",
      pareja2: "J. Rico - G. Coki",
      gamePareja1: null,
      gamePareja2: null,
      estado: "Pendiente" as const,
    },
    {
      id: "o-7",
      grupo: "Octavos",
      pareja1: "J. Tello - F. Navarro",
      pareja2: "E. Alonso - A. Arroyo",
      gamePareja1: null,
      gamePareja2: null,
      estado: "Pendiente" as const,
    },
    {
      id: "o-8",
      grupo: "Octavos",
      pareja1: "M. Semmler - P. Lijó",
      pareja2: "T. Zapata - F. Guerrero",
      gamePareja1: null,
      gamePareja2: null,
      estado: "Pendiente" as const,
    },
  ],
  cuartos: [
    {
      id: "c-1",
      grupo: "Cuartos",
      pareja1: "A. Tapia - A. Coello",
      pareja2: "J. Sanz - C. Nieto",
      gamePareja1: null,
      gamePareja2: null,
      estado: "Pendiente" as const,
    },
    {
      id: "c-2",
      grupo: "Cuartos",
      pareja1: "F. Chingotto - A. Galán",
      pareja2: "M. Di Nenno - F. Stupaczuk",
      gamePareja1: null,
      gamePareja2: null,
      estado: "Pendiente" as const,
    },
    {
      id: "c-3",
      grupo: "Cuartos",
      pareja1: "P. Lima - A. Ruiz",
      pareja2: "Ganador Octavos 6",
      gamePareja1: null,
      gamePareja2: null,
      estado: "Pendiente" as const,
    },
    {
      id: "c-4",
      grupo: "Cuartos",
      pareja1: "Ganador Octavos 7",
      pareja2: "Ganador Octavos 8",
      gamePareja1: null,
      gamePareja2: null,
      estado: "Pendiente" as const,
    },
  ],
  semifinal: [
    {
      id: "s-1",
      grupo: "Semifinal",
      pareja1: "Ganador Cuartos 1",
      pareja2: "Ganador Cuartos 2",
      gamePareja1: null,
      gamePareja2: null,
      estado: "Pendiente" as const,
    },
    {
      id: "s-2",
      grupo: "Semifinal",
      pareja1: "Ganador Cuartos 3",
      pareja2: "Ganador Cuartos 4",
      gamePareja1: null,
      gamePareja2: null,
      estado: "Pendiente" as const,
    },
  ],
  final: [
    {
      id: "f-1",
      grupo: "Final",
      pareja1: "Ganador Semifinal 1",
      pareja2: "Ganador Semifinal 2",
      gamePareja1: null,
      gamePareja2: null,
      estado: "Pendiente" as const,
    },
  ],
};

export default function App() {
  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem("padel_tournaments");
    return saved ? JSON.parse(saved) : DEFAULT_TOURNAMENTS;
  });

  const [selectedTournamentId, setSelectedTournamentId] = useState<
    string | null
  >(() => {
    return localStorage.getItem("padel_selected_tournament_id") || null;
  });

  const [loading, setLoading] = useState(false);
  const [lastImport, setLastImport] = useState<string | null>(() => {
    return localStorage.getItem("padel_last_import") || "Valores iniciales";
  });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<"TABLA" | "PARTIDOS">(
    "TABLA",
  );

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
        const timeFormatted =
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }) + " (Hoy)";
        setLastImport(timeFormatted);
        saveToStorage(data.tournaments, timeFormatted);
        localStorage.setItem("padel_has_imported", "true");
        setSuccessMsg("PARTIDOS ACTUALIZADOS CON ÉXITO");
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        throw new Error(
          data.error || "La respuesta de la planilla no fue exitosa.",
        );
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        `Error al conectar con la API de Google Sheets: ${err.message || "Por favor intente nuevamente."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  // Silent auto-import on mount if never imported before
  useEffect(() => {
    const hasImportedBefore =
      localStorage.getItem("padel_has_imported") === "true";
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
    if (
      window.confirm(
        "¿Seguro que deseas restablecer los datos al estado por defecto?",
      )
    ) {
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
    return tournaments.find((t) => t.id === selectedTournamentId) || null;
  }, [tournaments, selectedTournamentId]);

  const matches = useMemo(() => {
    return selectedTournament ? selectedTournament.matches : [];
  }, [selectedTournament]);

  // Filter matches belonging only to Group Stage (e.g. group name is not Octavos, Cuartos, Semifinal, Final or longer text)
  const groupStageMatchesOnly = useMemo(() => {
    return matches.filter((m) => {
      const g = m.grupo.toLowerCase();
      return (
        !g.includes("octavo") &&
        !g.includes("cuarto") &&
        !g.includes("semi") &&
        !g.includes("final") &&
        g.length <= 2
      );
    });
  }, [matches]);

  // Compute standings per group dynamically based on current matches
  const standings = useMemo(() => {
    const standingsMap: Record<string, Record<string, Standing>> = {};

    groupStageMatchesOnly.forEach((m) => {
      const { grupo, pareja1, pareja2, gamePareja1, gamePareja2, estado } = m;
      if (!standingsMap[grupo]) {
        standingsMap[grupo] = {};
      }

      [pareja1, pareja2].forEach((p) => {
        if (!standingsMap[grupo][p]) {
          standingsMap[grupo][p] = {
            pareja: p,
            grupo,
            jugados: 0,
            ganados: 0,
            perdidos: 0,
            gamesAFavor: 0,
            gamesEnContra: 0,
            difGames: 0,
          };
        }
      });

      if (estado === "Jugado" && gamePareja1 !== null && gamePareja2 !== null) {
        const stats1 = standingsMap[grupo][pareja1];
        const stats2 = standingsMap[grupo][pareja2];

        stats1.jugados += 1;
        stats2.jugados += 1;

        // Use precise games won/lost from sets if present, otherwise fallback to matches won (legacy format)
        const g1 =
          m.juegosPareja1 !== undefined ? m.juegosPareja1 : gamePareja1;
        const g2 =
          m.juegosPareja2 !== undefined ? m.juegosPareja2 : gamePareja2;

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
    Object.keys(standingsMap).forEach((grupo) => {
      result[grupo] = Object.values(standingsMap[grupo])
        .map((item) => ({
          ...item,
          difGames: item.gamesAFavor - item.gamesEnContra,
        }))
        .sort((a, b) => {
          // Tie-break standard sorting: Wins -> Game Diff -> Games For (Favor) -> Name
          if (b.ganados !== a.ganados) return b.ganados - a.ganados;
          if (b.difGames !== a.difGames) return b.difGames - a.difGames;
          if (b.gamesAFavor !== a.gamesAFavor)
            return b.gamesAFavor - a.gamesAFavor;
          return a.pareja.localeCompare(b.pareja);
        });
    });

    return result;
  }, [groupStageMatchesOnly]);

  // Statistics summaries
  const stats = useMemo(() => {
    const total = groupStageMatchesOnly.length;
    const played = groupStageMatchesOnly.filter(
      (m) => m.estado === "Jugado",
    ).length;
    const pending = total - played;
    const totalGames = groupStageMatchesOnly.reduce((acc, current) => {
      return acc + (current.gamePareja1 || 0) + (current.gamePareja2 || 0);
    }, 0);
    return { total, played, pending, totalGames };
  }, [groupStageMatchesOnly]);

  // Group matches by group (A, B, etc.)
  const groupedMatches = useMemo(() => {
    const groups: Record<string, Match[]> = {};
    groupStageMatchesOnly.forEach((m) => {
      const gName = m.grupo.toUpperCase();
      if (!groups[gName]) {
        groups[gName] = [];
      }
      groups[gName].push(m);
    });
    return Object.keys(groups)
      .sort()
      .map((gKey) => ({
        groupName: `GRUPO ${gKey}`,
        list: groups[gKey],
      }));
  }, [groupStageMatchesOnly]);

  // Playoff categorized structures
  const playoffRounds = useMemo(() => {
    const octavosM = matches.filter((m) =>
      m.grupo.toLowerCase().includes("octavo"),
    );
    const cuartosM = matches.filter((m) =>
      m.grupo.toLowerCase().includes("cuarto"),
    );
    const semifinalM = matches.filter((m) =>
      m.grupo.toLowerCase().includes("semi"),
    );
    const finalM = matches.filter(
      (m) =>
        m.grupo.toLowerCase().includes("final") &&
        !m.grupo.toLowerCase().includes("cuarto") &&
        !m.grupo.toLowerCase().includes("semi"),
    );

    return {
      octavos: octavosM.length > 0 ? octavosM : DEFAULT_PLAYOFFS.octavos,
      cuartos: cuartosM.length > 0 ? cuartosM : DEFAULT_PLAYOFFS.cuartos,
      semifinal:
        semifinalM.length > 0 ? semifinalM : DEFAULT_PLAYOFFS.semifinal,
      final: finalM.length > 0 ? finalM : DEFAULT_PLAYOFFS.final,
    };
  }, [matches]);

  const renderParejaName = (
    name: string | undefined | null,
    isWhiteTextBg: boolean = false,
  ) => {
    const clean = name ? name.trim() : "";
    if (!clean) {
      return (
        <span
          className={`italic font-mono text-[9px] font-normal lowercase tracking-wide ${isWhiteTextBg ? "text-zinc-400" : "text-zinc-500"}`}
        >
          a confirmar
        </span>
      );
    }
    return (
      <span translate="no" className="notranslate">
        {clean}
      </span>
    );
  };

  const renderSetScoresJSX = (
    matchItem: Match,
    isPareja1: boolean,
    isPlayoffCard: boolean = false,
  ) => {
    const isPlayed = matchItem.estado === "Jugado";
    if (!isPlayed) {
      return (
        <span className="text-zinc-400 text-xs italic opacity-60 font-mono">
          —
        </span>
      );
    }

    const sets = [matchItem.set1, matchItem.set2, matchItem.set3].filter(
      Boolean,
    ) as string[];
    let parsedSets: { g1: number; g2: number }[] = [];

    if (sets.length > 0) {
      parsedSets = sets.map((setStr) => {
        const clean = setStr.trim();
        const parts = clean
          .split(/[-/\x20]+/)
          .map((s) => s.trim())
          .filter(Boolean);
        if (parts.length >= 2) {
          const g1 = parseInt(parts[0], 10);
          const g2 = parseInt(parts[1], 10);
          return {
            g1: isNaN(g1) ? 0 : g1,
            g2: isNaN(g2) ? 0 : g2,
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
      return (
        <span className="text-zinc-400 text-xs italic opacity-60 font-mono">
          —
        </span>
      );
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
              ? "w-[21px] h-[21px] lg:w-[17px] lg:h-[17px] text-[13.5px] lg:text-[10.5px] font-black bg-emerald-600 text-white flex items-center justify-center font-mono rounded-none"
              : "w-[21px] h-[21px] lg:w-[17px] lg:h-[17px] text-[13.5px] lg:text-[10.5px] font-medium bg-white/10 text-zinc-300 flex items-center justify-center font-mono rounded-none border border-white/5";
          } else {
            boxClass = isSetWinner
              ? "w-[27px] h-[27px] lg:w-[21px] lg:h-[21px] text-[15.5px] lg:text-[12px] font-black bg-emerald-600 text-white flex items-center justify-center font-mono rounded-none"
              : "w-[27px] h-[27px] lg:w-[21px] lg:h-[21px] text-[15.5px] lg:text-[12px] font-semibold bg-white/15 text-zinc-200 flex items-center justify-center font-mono rounded-none border border-white/5";
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
        <header
          className="mb-5 border-b-2 border-[#1A1A1A] pb-3 flex flex-col gap-3"
          id="app-header"
        >
          <div className="w-full">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.8rem] xl:text-[4.8rem] font-black font-display tracking-tighter leading-none uppercase text-[#1A1A1A] w-full block break-all">
              @EVENTOSENVIVO.PADEL
            </h1>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-0">
            <p className="font-sans text-[11px] tracking-wider uppercase opacity-65 max-w-xl leading-relaxed">
              Acompañando cada evento deportivo en Santiago del Estero
            </p>

            {/* Action Hub and Link to Docs in Editorial style */}
            <div
              className="flex flex-col items-stretch sm:items-end gap-2 shrink-0"
              id="control-panel"
            >
              <div className="flex items-center gap-3">
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

              {selectedTournamentId && (
                <button
                  onClick={() => handleSelectTournament(null)}
                  className="self-stretch sm:self-end inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-widest text-zinc-700 hover:text-white bg-zinc-100 hover:bg-[#1A1A1A] border-2 border-[#1A1A1A] transition-all cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#1A1A1A]"
                >
                  <span>← Volver a Torneos</span>
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
              <div className="text-[11px] font-bold uppercase tracking-wider">
                {successMsg}
              </div>
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
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#1A1A1A]">
                  No se pudo realizar la sincronización
                </div>
                <div className="text-xs mt-1 leading-relaxed opacity-80">
                  {errorMsg}
                </div>
                <div className="mt-2 text-[10px] text-[#1A1A1A] bg-white border border-[#1A1A1A]/10 p-2.5">
                  <p className="font-bold uppercase tracking-wider mb-0.5">
                    Nota del sistema:
                  </p>
                  <p className="mb-1 opacity-80">
                    El documento original no está accesible temporalmente.
                    Puedes probar configurando el acceso público como
                    &quot;Cualquier persona con el enlace&quot; en Google Drive.
                  </p>
                  <p className="font-semibold text-red-600 font-mono">
                    ¡No te preocupes! El visualizador conserva el juego de datos
                    por defecto para que explores la interfaz deportiva.
                  </p>
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
                <span className="font-sans font-black uppercase text-red-650 tracking-wider block">
                  Panel de Torneos & Categorías
                </span>
                <p className="opacity-75 mt-0.5">
                  Selecciona uno de los torneos activos para visualizar partidos de grupos y Eliminatorias en tiempo real
                </p>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 whitespace-nowrap bg-zinc-100 p-1.5 border border-zinc-200 uppercase tracking-widest leading-none self-start md:self-auto">
                Último canje: {lastImport}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((t) => {
                const total = t.matches?.length || 0;
                // Group stage matches only for stats inside card
                const groupMatchesOnly =
                  t.matches?.filter((m) => {
                    const g = m.grupo.toLowerCase();
                    return (
                      !g.includes("octavo") &&
                      !g.includes("cuarto") &&
                      !g.includes("semi") &&
                      !g.includes("final") &&
                      g.length <= 2
                    );
                  }) || [];
                const played = groupMatchesOnly.filter(
                  (m) => m.estado === "Jugado",
                ).length;
                const progressPercent =
                  groupMatchesOnly.length > 0
                    ? Math.round((played / groupMatchesOnly.length) * 100)
                    : 0;

                // Get unique active groups
                const groups = Array.from(
                  new Set(groupMatchesOnly.map((m) => m.grupo.toUpperCase())),
                ).sort();

                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTournament(t.id)}
                    className="group bg-[#F4C430] hover:bg-[#F6CD4D] text-left p-3.5 border-2 border-[#1A1A1A] rounded-none shadow-[3px_3px_0px_0px_#1A1A1A] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#1A1A1A] flex flex-col justify-between min-h-[120px] cursor-pointer"
                  >
                    <div className="space-y-1.5 w-full">
                      {/* Badge / Index card styling */}
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]/60">
                          #{t.id.substring(0, 6)}
                        </span>
                        <span className="text-[8px] font-sans font-black bg-white/95 text-red-600 uppercase tracking-wider px-1.5 py-0.5 border border-red-500/10">
                          EN CURSO
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        translate="no"
                        className="text-sm font-black font-display uppercase tracking-tight text-[#1A1A1A] group-hover:text-red-600 transition-colors notranslate"
                      >
                        {t.name}
                      </h3>

                      {/* Groups label badges */}
                      {groups.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {groups.map((g) => (
                            <span
                              key={g}
                              className="text-[8px] font-mono font-bold bg-[#1A1A1A]/10 text-[#1A1A1A] px-1.5 py-0.5 border border-[#1A1A1A]/10"
                            >
                              GRUPO {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Progress details */}
                    <div className="w-full space-y-1.5 pt-2 border-t border-[#1A1A1A]/15 mt-2">
                      <div className="flex justify-between text-[9px] text-[#1A1A1A]/85 font-mono">
                        <span>
                          Fase de grupos: {played}/{groupMatchesOnly.length}{" "}
                          jugados
                        </span>
                        <span>{progressPercent}%</span>
                      </div>

                      {/* Bar */}
                      <div className="w-full bg-[#1A1A1A]/10 h-1.5 rounded-none overflow-hidden">
                        <div
                          className="bg-[#1A1A1A] h-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-bold text-[#1A1A1A] uppercase font-sans tracking-widest pt-1 shrink-0">
                        <span>Ver Estadísticas</span>
                        <span className="group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* IF TOURNAMENT IS SELECTED: SHOW ACTIVE TOURNAMENT VIEWS (TABLA, PARTIDOS, PLAYOFFS) */
          <>
            {/* Breadcrumbs / Navigation and back action */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Estás viendo:
              </span>
              <span
                translate="no"
                className="text-xs font-black font-display uppercase tracking-wider text-red-650 bg-red-50 border border-red-200 px-2 py-0.5 notranslate"
              >
                {selectedTournament?.name}
              </span>
            </div>

            {/* Navigation Tabs - Editorial Grid style */}
            <div
              className="flex border-2 border-[#1A1A1A] mb-6 text-center font-mono font-bold text-[10px] sm:text-xs uppercase"
              id="tab-navigation"
            >
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
                <span className="truncate">PARTIDOS</span>
              </button>
            </div>

            {/* Column layout wrapped with dynamic view handling */}
            <div className="w-full mx-auto transition-all duration-350 max-w-[1440px]">
              {/* LEFT COLUMN: Classification / Standings */}
              {activeTab === "TABLA" && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <section className="space-y-8" id="standings-section">
                    <div className="bg-[#FAF8F5] border border-[#1A1A1A]/10 p-3 sm:p-5 rounded-none">
                      <div className="flex items-center justify-between mb-6 border-b border-[#1A1A1A] pb-3">
                        <h2 className="text-lg sm:text-xl font-black font-display uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2">
                          <Award className="w-5 h-5 text-red-600" />{" "}
                          CLASIFICACIÓN
                        </h2>
                      </div>

                      {Object.keys(standings).length === 0 ? (
                        <div className="p-8 text-center text-zinc-500 text-xs italic">
                          Sin estadísticas disponibles. Sincroniza datos para
                          actualizar.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                          {Object.keys(standings)
                            .sort()
                            .map((grupoName) => (
                              <div
                                key={grupoName}
                                className="space-y-2.5 p-3 sm:p-3.5 bg-white border border-[#1A1A1A]/5 shadow-[1px_1px_3px_rgba(0,0,0,0.02)]"
                                id={`group-box-${grupoName}`}
                              >
                                <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-1.5">
                                  <span className="text-xs sm:text-sm font-black font-display uppercase tracking-tighter text-[#1A1A1A]">
                                    GRUPO {grupoName}
                                  </span>
                                  <span className="text-[9px] font-mono text-zinc-400">
                                    ({standings[grupoName].length} parejas)
                                  </span>
                                </div>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-left border-collapse">
                                    <thead>
                                      <tr className="border-b border-[#1A1A1A]/20 text-[8px] uppercase font-bold text-zinc-500 tracking-wider font-mono">
                                        <th className="py-1 px-0.5 text-center w-6">
                                          RANK
                                        </th>
                                        <th className="py-1 px-1 sm:px-1.5">
                                          PAREJA
                                        </th>
                                        <th
                                          className="py-1 px-1 text-center"
                                          title="Partidos Jugados"
                                        >
                                          PJ
                                        </th>
                                        <th
                                          className="py-1 px-1 text-center text-red-600"
                                          title="Partidos Ganados"
                                        >
                                          PG
                                        </th>
                                        <th
                                          className="py-1 px-1 text-center text-black font-bold"
                                          title="Diferencia de Games"
                                        >
                                          DF
                                        </th>
                                        <th
                                          className="py-1 px-1 text-center text-zinc-500"
                                          title="Games a favor : en contra"
                                        >
                                          PTS
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#1A1A1A]/5 text-[10px] sm:text-xs">
                                      {standings[grupoName].map(
                                        (standingItem, idx) => {
                                          const isTop2 = idx < 2;
                                          return (
                                            <tr
                                              key={standingItem.pareja}
                                              className={`hover:bg-[#1A1A1A]/5 transition-colors ${
                                                isTop2
                                                  ? "bg-emerald-100/40 font-medium"
                                                  : ""
                                              }`}
                                            >
                                              <td className="py-1 px-0.5 text-center font-sans font-bold italic text-[11px] text-zinc-600">
                                                {idx + 1}.
                                              </td>
                                              <td
                                                translate="no"
                                                className="py-1 px-1 sm:px-1.5 font-semibold text-[#1A1A1A] tracking-tight leading-tight uppercase text-[9.5px] sm:text-[10.5px] notranslate break-all max-w-[100px] sm:max-w-none"
                                              >
                                                {standingItem.pareja}
                                              </td>
                                              <td className="py-1 px-1 text-center font-mono text-zinc-650 text-[9.5px] sm:text-[10px]">
                                                {standingItem.jugados}
                                              </td>
                                              <td className="py-1 px-1 text-center font-mono text-red-600 font-bold text-[9.5px] sm:text-[10px]">
                                                {standingItem.ganados}
                                              </td>
                                              <td
                                                className={`py-1 px-1 text-center font-mono font-bold text-[9.5px] sm:text-[10px] ${
                                                  standingItem.difGames > 0
                                                    ? "text-emerald-700"
                                                    : standingItem.difGames < 0
                                                      ? "text-red-700"
                                                      : "text-zinc-500"
                                                }`}
                                              >
                                                {standingItem.difGames > 0
                                                  ? `+${standingItem.difGames}`
                                                  : standingItem.difGames}
                                              </td>
                                              <td className="py-1 px-1 text-center font-mono text-[9px] text-zinc-500 whitespace-nowrap">
                                                {standingItem.gamesAFavor}:
                                                {standingItem.gamesEnContra}
                                              </td>
                                            </tr>
                                          );
                                        },
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}

                      
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
                  className="space-y-10 w-full select-none"
                >
                  {/* UPPER SECTION: Fase de Grupos (full-width) */}
                  <div className="w-full space-y-6">
                    <section className="space-y-6" id="matches-section">
                    <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#1A1A1A]">
                      <h2 className="text-[15px] font-black font-mono tracking-widest uppercase text-[#1A1A1A]">
                        Fase de Grupos
                      </h2>
                    </div>
                    {/* Total Results Feed Counter */}
                    <div className="bg-[#FAF8F5] border-l-2 border-red-650 p-3 text-[11px] text-[#1A1A1A] leading-relaxed">
                      <span className="font-bold block uppercase text-red-650 tracking-wider mb-0.5">
                        Reglamento Fase de Grupos
                      </span>
                      <p className="opacity-80">
                        Cada pareja juega 2 partidos por grupo. Clasifican las 2 mejores parejas. En grupo de 3 juegan TODOS vs TODOS. En grupo de 4 juegan 1vs2, 3vs4 y luego GANADORES vs PERDEDORES.
                      </p>
                    </div>

                    {/* List and Feed representing matches */}
                    <div className={groupedMatches.length === 0 ? "w-full" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start"}>
                      <AnimatePresence mode="popLayout">
                        {groupedMatches.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-16 text-center rounded-none bg-[#FAF8F5] border border-dashed border-[#1A1A1A]/15 text-zinc-500"
                          >
                            <p className="text-xs uppercase tracking-wider font-bold mb-1">
                              No hay partidos cargados
                            </p>
                          </motion.div>
                        ) : (
                          groupedMatches.map((group, groupIndex) => (
                            <motion.div
                              key={group.groupName}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{
                                duration: 0.25,
                                delay: groupIndex * 0.05,
                              }}
                              className="p-4 bg-[#FAF8F5] border border-[#1A1A1A]/10 space-y-4"
                              id={`group-card-${group.groupName.replace(/\s+/g, "-").toLowerCase()}`}
                            >
                              {/* Header of the Group General Card */}
                              <div className="flex items-center justify-between pb-1.5 border-b border-[#1A1A1A]/10">
                                <h3 className="text-[14px] font-black font-mono tracking-widest uppercase text-[#1A1A1A]">
                                  {group.groupName}
                                </h3>
                              </div>

                              {/* Vertical list of matches in this group */}
                              <div className="space-y-3">
                                {group.list.map((matchItem) => {
                                  const isPlayed =
                                    matchItem.estado === "Jugado";
                                  const isWinnerP1 =
                                    isPlayed &&
                                    (matchItem.gamePareja1 || 0) >
                                      (matchItem.gamePareja2 || 0);
                                  const isWinnerP2 =
                                    isPlayed &&
                                    (matchItem.gamePareja2 || 0) >
                                      (matchItem.gamePareja1 || 0);

                                  return (
                                    <div
                                      key={matchItem.id}
                                      className={`rounded-none border p-3 transition-all duration-300 shadow-[1px_1px_3px_rgba(0,0,0,0.02)] ${
                                        isPlayed
                                          ? "bg-[#1A1A1A] text-white border-transparent"
                                          : "bg-[#FAF8F5]/90 text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30"
                                      }`}
                                      id={`match-card-${matchItem.id}`}
                                    >
                                      <div className="flex items-center justify-between mb-1.5 text-[8px] font-bold font-mono tracking-wider opacity-60">
                                        <span>PARTIDO</span>
                                        <span>
                                          {isPlayed ? "JUGADO" : "PENDIENTE"}
                                        </span>
                                      </div>
                                      <div className="space-y-1.5">
                                        {/* Player 1 Row */}
                                        <div
                                          className={`flex items-center justify-between px-2 py-1 rounded-none text-[10px] uppercase ${
                                            isPlayed
                                              ? isWinnerP1
                                                ? "font-black text-white"
                                                : "opacity-35 text-white"
                                              : "bg-white/85 border border-[#1A1A1A]/5 font-semibold"
                                          }`}
                                        >
                                          <span className="truncate pr-1.5">
                                            {renderParejaName(
                                              matchItem.pareja1,
                                              isPlayed,
                                            )}
                                          </span>
                                          {renderSetScoresJSX(matchItem, true, true)}
                                        </div>
                                        {/* Player 2 Row */}
                                        <div
                                          className={`flex items-center justify-between px-2 py-1 rounded-none text-[10px] uppercase ${
                                            isPlayed
                                              ? isWinnerP2
                                                ? "font-black text-white"
                                                : "opacity-35 text-white"
                                              : "bg-white/85 border border-[#1A1A1A]/5 font-semibold"
                                          }`}
                                        >
                                          <span className="truncate pr-1.5">
                                            {renderParejaName(
                                              matchItem.pareja2,
                                              isPlayed,
                                            )}
                                          </span>
                                          {renderSetScoresJSX(matchItem, false, true)}
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
                </div>

                {/* LOWER SECTION: Eliminatorias (Playoffs) */}
                <div className="pt-8 border-t-2 border-[#1A1A1A] w-full space-y-12">
                  {/* Row of 3 Columns: Octavos, Cuartos, Semis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start w-full">
                    {/* COLUMN 1: Octavos de Final */}
                    <div className="space-y-6">
                      <section className="space-y-6">
                        <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#1A1A1A]">
                          <h2 className="text-[14px] sm:text-[15px] font-black font-mono tracking-widest uppercase text-[#1A1A1A]">
                            Octavos de Final
                          </h2>
                        </div>

                        {/* Header of Playoffs Section */}
                        <div className="bg-[#FAF8F5] border-l-2 border-red-650 p-3 text-[11px] text-[#1A1A1A] leading-relaxed">
                          <span className="font-bold block uppercase text-red-650 tracking-wider mb-0.5">
                            Eliminatorias 8vos
                          </span>
                          <p className="opacity-80 text-[10px]">
                            Rondas eliminatorias directas. Sincronizadas en tiempo real.
                          </p>
                        </div>

                        {/* Octavos Matches List */}
                        <div className="space-y-4">
                          {(() => {
                            const octavosPairs = [];
                            for (let i = 0; i < playoffRounds.octavos.length; i += 2) {
                              octavosPairs.push(playoffRounds.octavos.slice(i, i + 2));
                            }
                            return octavosPairs.map((pair, pairIdx) => {
                              return (
                                <div key={pairIdx} className="flex items-stretch gap-3">
                                  {/* Left Side: The 2 matches in this branch */}
                                  <div className="flex-1 space-y-2">
                                    {pair.map((matchItem, subIdx) => {
                                      const globalIdx = pairIdx * 2 + subIdx;
                                      const isAnnulled = (matchItem.pareja1 || "").trim().toUpperCase() === "NO";
                                      const isPlayed = matchItem.estado === "Jugado";
                                      const isWinnerP1 =
                                        isPlayed &&
                                        (matchItem.gamePareja1 || 0) >
                                          (matchItem.gamePareja2 || 0);
                                      const isWinnerP2 =
                                        isPlayed &&
                                        (matchItem.gamePareja2 || 0) >
                                          (matchItem.gamePareja1 || 0);
                                      return (
                                        <div
                                          key={matchItem.id}
                                          className={`rounded-none border p-3 transition-all duration-300 shadow-[1px_1px_3px_rgba(0,0,0,0.02)] ${
                                            isAnnulled
                                              ? "bg-zinc-100/50 text-zinc-400 border-dashed border-zinc-200 opacity-60 pointer-events-none select-none"
                                              : isPlayed
                                                ? "bg-[#1A1A1A] text-white border-transparent"
                                                : "bg-[#FAF8F5]/90 text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30"
                                          }`}
                                        >
                                          <div className="flex items-center justify-between mb-1.5 text-[8px] font-bold font-mono tracking-wider opacity-60">
                                            <span>OCTAVOS #{globalIdx + 1}</span>
                                            <span>
                                              {isAnnulled ? "NO SE JUEGA" : isPlayed ? "JUGADO" : "PENDIENTE"}
                                            </span>
                                          </div>
                                          <div className="space-y-1.5">
                                            {/* Player 1 Row */}
                                            <div
                                              className={`flex items-center justify-between px-2 py-1 rounded-none text-[10px] uppercase ${
                                                isAnnulled
                                                  ? "bg-zinc-200/20 border border-zinc-300/20 text-zinc-400/80 font-normal line-through"
                                                  : isPlayed
                                                    ? isWinnerP1
                                                      ? "font-black text-white"
                                                      : "opacity-35 text-white"
                                                    : "bg-white/85 border border-[#1A1A1A]/5 font-semibold"
                                              }`}
                                            >
                                              <span className="truncate pr-1.5">
                                                {renderParejaName(
                                                  matchItem.pareja1,
                                                  isPlayed || isAnnulled,
                                                )}
                                              </span>
                                              {!isAnnulled && renderSetScoresJSX(matchItem, true, true)}
                                            </div>
                                            {/* Player 2 Row */}
                                            <div
                                              className={`flex items-center justify-between px-2 py-1 rounded-none text-[10px] uppercase ${
                                                isAnnulled
                                                  ? "bg-zinc-200/20 border border-zinc-300/20 text-zinc-400/80 font-normal line-through"
                                                  : isPlayed
                                                    ? isWinnerP2
                                                      ? "font-black text-white"
                                                      : "opacity-35 text-white"
                                                    : "bg-white/85 border border-[#1A1A1A]/5 font-semibold"
                                              }`}
                                            >
                                              <span className="truncate pr-1.5">
                                                {renderParejaName(
                                                  matchItem.pareja2,
                                                  isPlayed || isAnnulled,
                                                )}
                                              </span>
                                              {!isAnnulled && renderSetScoresJSX(matchItem, false, true)}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Right Side: Visual bracket connecting the 2 matches */}
                                  {pair.length === 2 && (
                                    <div className="flex items-center justify-center w-12 sm:w-14 shrink-0 relative">
                                      <svg
                                        viewBox="0 0 40 100"
                                        className="w-full h-full text-[#1A1A1A]/20 stroke-current"
                                        fill="none"
                                        strokeWidth="1"
                                        preserveAspectRatio="none"
                                      >
                                        <path
                                          d="M 5,25 L 18,25 Q 24,25 24,30 L 24,44 Q 24,48 32,50 Q 24,52 24,56 L 24,70 Q 24,75 18,75 L 5,75"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 text-[7px] font-black font-mono text-[#1A1A1A]/40 uppercase whitespace-nowrap bg-[#FAF8F5] px-1 py-0.5 border border-[#1A1A1A]/10 shadow-[1px_1px_0px_rgba(0,0,0,0.03)] scale-90 sm:scale-100">
                                        4TOS #{pairIdx + 1}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </section>
                    </div>

                    {/* COLUMN 2: Cuartos de Final */}
                    <div className="space-y-6 lg:border-l lg:border-[#1A1A1A]/10 lg:pl-6 xl:pl-8">
                      <section className="space-y-6">
                        <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#1A1A1A]">
                          <h2 className="text-[14px] sm:text-[15px] font-black font-mono tracking-widest uppercase text-[#1A1A1A]">
                            Cuartos de Final
                          </h2>
                        </div>

                        {/* Header of Cuartos */}
                        <div className="bg-[#FAF8F5] border-l-2 border-red-650 p-3 text-[11px] text-[#1A1A1A] leading-relaxed">
                          <span className="font-bold block uppercase text-red-650 tracking-wider mb-0.5">
                            Eliminatorias 4tos
                          </span>
                          <p className="opacity-80 text-[10px]">
                            Partidos clasificatorios rumbo a las semifinales.
                          </p>
                        </div>

                        <div className="space-y-3.5">
                          {playoffRounds.cuartos.map((matchItem, idx) => {
                            const isPlayed = matchItem.estado === "Jugado";
                            const isWinnerP1 =
                              isPlayed &&
                              (matchItem.gamePareja1 || 0) >
                                (matchItem.gamePareja2 || 0);
                            const isWinnerP2 =
                              isPlayed &&
                              (matchItem.gamePareja2 || 0) >
                                (matchItem.gamePareja1 || 0);
                            return (
                              <div
                                key={matchItem.id}
                                className={`rounded-none border p-3 transition-all duration-300 shadow-[2px_2px_4px_rgba(0,0,0,0.03)] ${
                                  isPlayed
                                    ? "bg-[#1A1A1A] text-white border-transparent"
                                    : "bg-[#FAF8F5]/90 text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1.5 text-[8px] font-bold font-mono tracking-wider opacity-60">
                                  <span>CUARTOS #{idx + 1}</span>
                                  <span>
                                    {isPlayed ? "JUGADO" : "PENDIENTE"}
                                  </span>
                                </div>
                                <div className="space-y-1.5">
                                  {/* Player 1 Row */}
                                  <div
                                    className={`flex items-center justify-between px-2 py-1 rounded-none text-[10px] uppercase ${
                                      isPlayed
                                        ? isWinnerP1
                                          ? "font-black text-white"
                                          : "opacity-35 text-white"
                                        : "bg-white/85 border border-[#1A1A1A]/5 font-semibold"
                                    }`}
                                  >
                                    <span className="truncate pr-1.5">
                                      {renderParejaName(
                                        matchItem.pareja1,
                                        isPlayed,
                                      )}
                                    </span>
                                    {renderSetScoresJSX(matchItem, true, true)}
                                  </div>
                                  {/* Player 2 Row */}
                                  <div
                                    className={`flex items-center justify-between px-2 py-1 rounded-none text-[10px] uppercase ${
                                      isPlayed
                                        ? isWinnerP2
                                          ? "font-black text-white"
                                          : "opacity-35 text-white"
                                        : "bg-white/85 border border-[#1A1A1A]/5 font-semibold"
                                    }`}
                                  >
                                    <span className="truncate pr-1.5">
                                      {renderParejaName(
                                        matchItem.pareja2,
                                        isPlayed,
                                      )}
                                    </span>
                                    {renderSetScoresJSX(matchItem, false, true)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    </div>

                    {/* COLUMN 3: Semifinales */}
                    <div className="space-y-6 lg:border-l lg:border-[#1A1A1A]/10 lg:pl-6 xl:pl-8">
                      <section className="space-y-6">
                        <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#1A1A1A]">
                          <h2 className="text-[14px] sm:text-[15px] font-black font-mono tracking-widest uppercase text-[#1A1A1A]">
                            Semifinales
                          </h2>
                        </div>

                        {/* Header of Semis */}
                        <div className="bg-[#FAF8F5] border-l-2 border-red-650 p-3 text-[11px] text-[#1A1A1A] leading-relaxed">
                          <span className="font-bold block uppercase text-red-650 tracking-wider mb-0.5">
                            Eliminatorias Semis
                          </span>
                          <p className="opacity-80 text-[10px]">
                            Partidos de máxima tensión por el pase a la gran final.
                          </p>
                        </div>

                        <div className="space-y-3.5">
                          {playoffRounds.semifinal.map((matchItem, idx) => {
                            const isPlayed = matchItem.estado === "Jugado";
                            const isWinnerP1 =
                              isPlayed &&
                              (matchItem.gamePareja1 || 0) >
                                (matchItem.gamePareja2 || 0);
                            const isWinnerP2 =
                              isPlayed &&
                              (matchItem.gamePareja2 || 0) >
                                (matchItem.gamePareja1 || 0);
                            return (
                              <div
                                key={matchItem.id}
                                className={`rounded-none border p-3 transition-all duration-300 shadow-[3px_3px_5px_rgba(0,0,0,0.04)] ${
                                  isPlayed
                                    ? "bg-[#1A1A1A] text-white border-transparent"
                                    : "bg-[#FAF8F5]/90 text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1.5 text-[8px] font-bold font-mono tracking-wider opacity-60">
                                  <span>SEMIFINAL #{idx + 1}</span>
                                  <span>
                                    {isPlayed ? "JUGADO" : "PENDIENTE"}
                                  </span>
                                </div>
                                <div className="space-y-1.5">
                                  {/* Player 1 Row */}
                                  <div
                                    className={`flex items-center justify-between px-2 py-1 rounded-none text-[10px] uppercase ${
                                      isPlayed
                                        ? isWinnerP1
                                          ? "font-black text-white"
                                          : "opacity-35 text-white"
                                        : "bg-white/85 border border-[#1A1A1A]/5 font-semibold"
                                    }`}
                                  >
                                    <span className="truncate pr-1.5">
                                      {renderParejaName(
                                        matchItem.pareja1,
                                        isPlayed,
                                      )}
                                    </span>
                                    {renderSetScoresJSX(matchItem, true, true)}
                                  </div>
                                  {/* Player 2 Row */}
                                  <div
                                    className={`flex items-center justify-between px-2 py-1 rounded-none text-[10px] uppercase ${
                                      isPlayed
                                        ? isWinnerP2
                                          ? "font-black text-white"
                                          : "opacity-35 text-white"
                                        : "bg-white/85 border border-[#1A1A1A]/5 font-semibold"
                                    }`}
                                  >
                                    <span className="truncate pr-1.5">
                                      {renderParejaName(
                                        matchItem.pareja2,
                                        isPlayed,
                                      )}
                                    </span>
                                    {renderSetScoresJSX(matchItem, false, true)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>

                      {/* LA GRAN FINAL - SECCIÓN AMARILLO/DORADO */}
                      <section className="space-y-6 pt-4 border-t border-[#1A1A1A]/10">
                        <div className="flex items-center justify-between pb-1.5 border-b-2 border-amber-500">
                          <h2 className="text-[14px] sm:text-[15px] font-black font-mono tracking-widest uppercase text-amber-600 flex items-center gap-2">
                            <span>🏆</span>
                            <span>La Gran Final</span>
                          </h2>
                        </div>

                        {/* Grand Final Cards Container */}
                        <div className="space-y-3.5">
                          {playoffRounds.final.map((matchItem) => {
                            const isPlayed = matchItem.estado === "Jugado";
                            const isWinnerP1 =
                              isPlayed &&
                              (matchItem.gamePareja1 || 0) >
                                (matchItem.gamePareja2 || 0);
                            const isWinnerP2 =
                              isPlayed &&
                              (matchItem.gamePareja2 || 0) >
                                (matchItem.gamePareja1 || 0);
                            return (
                              <div
                                key={matchItem.id}
                                className={`rounded-none border-2 p-3.5 transition-all duration-300 relative overflow-hidden ${
                                  isPlayed
                                    ? "bg-[#1A1A1A] text-white border-amber-500 shadow-[0_4px_12px_rgba(245,158,11,0.15)] ring-1 ring-amber-500"
                                    : "bg-amber-50/45 text-[#1A1A1A] border-dashed border-amber-500 shadow-[2px_2px_4px_rgba(0,0,0,0.02)]"
                                }`}
                              >
                                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[5px] font-black uppercase px-1.5 py-0.5 tracking-wider font-mono">
                                  CAMPEONATO
                                </div>
                                <div className="flex items-center justify-between mb-1.5 text-[8px] font-bold font-mono tracking-wider opacity-60">
                                  <span>FINAL</span>
                                  <span>
                                    {isPlayed ? "JUGADO" : "PENDIENTE"}
                                  </span>
                                </div>
                                <div className="space-y-1.5">
                                  {/* Player 1 Row */}
                                  <div
                                    className={`flex items-center justify-between px-2 py-1 rounded-none text-[10px] uppercase ${
                                      isPlayed
                                        ? isWinnerP1
                                          ? "font-black text-amber-400 text-[11px]"
                                          : "opacity-35 text-white"
                                        : "bg-white/95 border border-amber-200/60 font-bold"
                                    }`}
                                  >
                                    <span className="truncate pr-1.5">
                                      {renderParejaName(
                                        matchItem.pareja1,
                                        isPlayed,
                                      )}
                                    </span>
                                    {renderSetScoresJSX(matchItem, true, true)}
                                  </div>
                                  {/* Player 2 Row */}
                                  <div
                                    className={`flex items-center justify-between px-2 py-1 rounded-none text-[10px] uppercase ${
                                      isPlayed
                                        ? isWinnerP2
                                          ? "font-black text-amber-400 text-[11px]"
                                          : "opacity-35 text-white"
                                        : "bg-white/95 border border-amber-200/60 font-bold"
                                    }`}
                                  >
                                    <span className="truncate pr-1.5">
                                      {renderParejaName(
                                        matchItem.pareja2,
                                        isPlayed,
                                      )}
                                    </span>
                                    {renderSetScoresJSX(matchItem, false, true)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    </div>
                  </div>
                </div> {/* Closing LOWER SECTION */}
                </motion.div>
              )}
            </div>
          </>
        )}

        {/* Humble, Professional Footer without clutter */}
        <footer className="mt-20 pt-10 border-t border-[#1A1A1A]/10 text-center text-zinc-500 text-xs">
          <p className="font-sans uppercase tracking-widest text-[9px] font-bold">
            &copy; {new Date().getFullYear()} I Torneo de Pádel _ Todos los
            derechos reservados. Edición Deportiva Especial.
          </p>
          <div className="mt-2 text-[9px] font-mono opacity-80">
            Enlace fuente de datos externa:{" "}
            <span className="text-[#1A1A1A] hover:text-red-650 transition-colors font-bold uppercase">
              {GOOGLE_SHEETS_URL.split("?")[0]}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

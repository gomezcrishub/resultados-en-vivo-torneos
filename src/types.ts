export interface Match {
  id: string;
  grupo: string;
  pareja1: string;
  pareja2: string;
  gamePareja1: number | null; // representa sets ganados (o juegos en 1 set)
  gamePareja2: number | null; // representa sets ganados (o juegos en 1 set)
  juegosPareja1?: number; // suma total de juegos de todos los sets
  juegosPareja2?: number; // suma total de juegos de todos los sets
  estado: "Jugado" | "Pendiente";
  set1?: string | null;
  set2?: string | null;
  set3?: string | null;
}

export interface Tournament {
  id: string; // representa gid de la hoja
  name: string; // nombre de la hoja (ej: "Masculino A")
  matches: Match[];
  error?: string;
}

export interface Standing {
  pareja: string;
  grupo: string;
  jugados: number;
  ganados: number;
  perdidos: number;
  gamesAFavor: number;
  gamesEnContra: number;
  difGames: number;
}

export interface ImportResponse {
  success: boolean;
  tournaments: Tournament[];
  importedAt: string;
  error?: string;
}

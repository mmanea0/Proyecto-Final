export interface Anime {
  id: number;
  nombre_original: string;
  nombre_en: string;
  nombre_original_sin_kanji: string;
  foto: string;
  sipnosis: string;
  fecha_de_estreno: string;
  estudio_de_animacion: string;
  capitulos_totales: number;
  valoracion: number;
  categoria: string;
  estado: string;
  season: string;
  banner:string;
  capitulos?: Capitulo[];
}
export interface Capitulo {
  id: number;
  anime_id: number;
  numero_capitulo: number;
  sipnosis: string;
  duracion: number;
  enlaces: Enlace[];
}
export interface Enlace {
  id: number;
  url: string;
  capitulo_id: number;
}

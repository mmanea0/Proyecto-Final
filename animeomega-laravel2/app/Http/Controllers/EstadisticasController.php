<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\BibliotecaAnime;
use App\Models\Genero;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EstadisticasController extends Controller
{
    public function generosmasvistos()
    {
        // Recupera todos los géneros con el conteo de animes vistos
        $generosMasVistos = Genero::select('generos.genero', DB::raw('COUNT(DISTINCT biblioteca_capitulos.capitulo_id) as total'))
            ->leftJoin('generos_animes', 'generos.id', '=', 'generos_animes.genero_id')
            ->leftJoin('animes', 'generos_animes.anime_id', '=', 'animes.id')
            ->leftJoin('capitulos_animes', 'animes.id', '=', 'capitulos_animes.anime_id')
            ->leftJoin('biblioteca_capitulos', 'capitulos_animes.id', '=', 'biblioteca_capitulos.capitulo_id')
            ->where('biblioteca_capitulos.visto', true)
            ->orWhereNull('biblioteca_capitulos.visto')
            ->groupBy('generos.genero')
            ->orderByDesc('total')
            ->get();

        return response()->json($generosMasVistos);
    }


    public function animesfavoritos()
    {
        // Obtener el nombre del anime y contar cuántos usuarios lo tienen como favorito
        $animesFavoritos = BibliotecaAnime::select('animes.nombre_original_sin_kanji', DB::raw('COUNT(biblioteca_anime.id) as total_favoritos'))
            ->join('animes', 'animes.id', '=', 'biblioteca_anime.id_anime')
            ->where('biblioteca_anime.favorito', 1)
            ->groupBy('animes.nombre_original_sin_kanji')
            ->get();

        return $animesFavoritos;
    }

    public function animesAbandonados()
    {
        return Anime::join('biblioteca_anime', 'animes.id', '=', 'biblioteca_anime.id_anime')
            ->select('animes.nombre_original_sin_kanji', DB::raw('COUNT(biblioteca_anime.id) as total_abandonados'))
            ->where('biblioteca_anime.estado_id', '=', '4')
            ->groupBy('animes.nombre_original_sin_kanji')
            ->get();
    }

    public function aniemesCompletados(){
        return Anime::join('biblioteca_anime', 'animes.id', '=', 'biblioteca_anime.id_anime')
            ->select('animes.nombre_original_sin_kanji', DB::raw('COUNT(biblioteca_anime.id) as total_completados'))
            ->where('biblioteca_anime.estado_id', '=', '3')
            ->groupBy('animes.nombre_original_sin_kanji')
            ->get();
    }

    public function usuarioquemasanimesavisto()
    {
        return BibliotecaAnime::select('users.name AS usuario', DB::raw('COUNT(biblioteca_anime.id) as total_vistos'))
            ->join('users', 'users.id', '=', 'biblioteca_anime.id_usuario')
            ->where('biblioteca_anime.estado_id', 3)
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('total_vistos')
            ->get();
    }


}

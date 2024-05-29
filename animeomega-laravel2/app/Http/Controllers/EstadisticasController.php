<?php

namespace App\Http\Controllers;

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
}

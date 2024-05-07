<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Genero;
use Illuminate\Http\Request;


class AnimesController extends Controller
{


    public function prueba()
    {
        // Crear un nuevo anime utilizando el modelo Anime
        $anime = new Anime();
        $anime->nombre_original = 'hola';
        $anime->nombre_en = 'Adios';
        $anime->nombre_original_sin_kanji = 'Nombre Original sin Kanji del Anime';
        $anime->foto = 'URL de la Foto del Anime';
        $anime->sipnosis = 'Sipnosis del Anime';
        $anime->fecha_de_estreno = now(); // Puedes ajustar la fecha de estreno según sea necesario
        $anime->estudio_de_animacion = 'Estudio de Animación del Anime';
        $anime->capitulos_totales = 24; // Número total de capítulos del Anime
        $anime->valoracion = 8.5; // Valoración del Anime
        $anime->categoria_id = 1; // ID de la categoría del Anime (debes ajustarlo según tu base de datos)
        $anime->estado_id = 1; // ID del estado del Anime (debes ajustarlo según tu base de datos)
        $anime->season_id = 1; // ID de la temporada del Anime (debes ajustarlo según tu base de datos)
        $anime->save();

        // Devolver una respuesta para indicar que se han agregado los datos correctamente
        return response()->json(['message' => 'Datos del anime agregados correctamente'], 200);
    }

    public function getAnimes()
    {
        // Obtener todos los animes con las relaciones cargadas
        $animes = Anime::with('categoria', 'estado', 'season')->get();

        // Transformar los resultados
        $animesTransformados = $animes->map(function ($anime) {
            return [
                'id' => $anime->id,
                'nombre_original' => $anime->nombre_original,
                'nombre_en' => $anime->nombre_en,
                'nombre_original_sin_kanji' => $anime->nombre_original_sin_kanji,
                'foto' => $anime->foto,
                'sipnosis' => $anime->sipnosis,
                'fecha_de_estreno' => $anime->fecha_de_estreno,
                'estudio_de_animacion' => $anime->estudio_de_animacion,
                'capitulos_totales' => $anime->capitulos_totales,
                'valoracion' => $anime->valoracion,
                'categoria' => $anime->categoria->tipo,
                'estado' => $anime->estado->estado,
                'season' => $anime->season->apoca,
            ];
        });

        // Devolver los animes transformados en formato JSON
        return response()->json($animesTransformados);
    }

    public function findAnime(Request $request, $anime)
    {
        // Realizar la búsqueda de anime por nombre original o en inglés
        $animes = Anime::where('nombre_original', 'LIKE', "%$anime%")
            ->orWhere('nombre_en', 'LIKE', "%$anime%")
            ->get();

        // Verificar si se encontraron resultados
        if ($animes->isEmpty()) {
            // No se encontraron resultados, devolver un mensaje de error
            return response()->json(['message' => 'No se encontraron resultados para la búsqueda: ' . $anime], 404);
        }

        // Se encontraron resultados, devolver los animes encontrados
        return response()->json($animes);
    }

    public function findGenero(Request $request, $genero)
    {
        // Realizar la búsqueda de animes por género
        $animes = Anime::whereHas('generos', function ($query) use ($genero) {
            $query->where('genero', 'LIKE', "%$genero%");
        })->get();

        // Verificar si se encontraron resultados
        if ($animes->isEmpty()) {
            return response()->json(['message' => 'No se encontraron animes para el género: ' . $genero], 404);
        }
        return response()->json($animes);
    }


}

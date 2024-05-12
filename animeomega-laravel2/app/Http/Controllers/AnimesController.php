<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Enlace;
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
                'banner' => $anime->banner,
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


    public function show(Request $request, $id)
    {
        // Obtener el anime por ID con los capítulos relacionados
        $anime = Anime::with('capitulos')->find($id);

        // Verificar si se encontró el anime
        if (!$anime) {
            // No se encontró el anime, devolver un mensaje de error
            return response()->json(['message' => 'Anime no encontrado'], 404);
        }

        // Se encontró el anime, devolver el anime en formato JSON
        return [
            'id' => $anime->id,
            'nombre_original' => $anime->nombre_original,
            'nombre_en' => $anime->nombre_en,
            'nombre_original_sin_kanji' => $anime->nombre_original_sin_kanji,
            'foto' => $anime->foto,
            'banner' => $anime->banner,
            'sipnosis' => $anime->sipnosis,
            'fecha_de_estreno' => $anime->fecha_de_estreno,
            'estudio_de_animacion' => $anime->estudio_de_animacion,
            'capitulos_totales' => $anime->capitulos_totales,
            'valoracion' => $anime->valoracion,
            'categoria' => $anime->categoria->tipo,
            'estado' => $anime->estado->estado,
            'season' => $anime->season->apoca,
            'capitulos' => $anime->capitulos, // Agregar los capítulos al resultado
        ];
    }


    public function enlacesCapitulo(Request $request, $animeId, $capituloId)
    {
        // Obtener los enlaces de un capítulo específico
        $enlaces = Enlace::where('capitulo_id', $capituloId)->get();

        // Verificar si se encontraron enlaces
        if ($enlaces->isEmpty()) {
            // No se encontraron enlaces, devolver un mensaje de error
            return response()->json(['message' => 'No se encontraron enlaces para el capítulo'], 404);
        }

        // Se encontraron enlaces, devolver los enlaces en formato JSON
        return response()->json($enlaces);
    }

    public function ultimosanimesañadidos()
    {
        // Obtener los últimos 10 animes añadidos
        $animes = Anime::orderBy('created_at', 'desc')->take(5)->get();

        // Transformar los resultados
        $animesTransformados = $animes->map(function ($anime) {
            return [
                'id' => $anime->id,
                'nombre_original' => $anime->nombre_original,
                'nombre_en' => $anime->nombre_en,
                'nombre_original_sin_kanji' => $anime->nombre_original_sin_kanji,
                'foto' => $anime->foto,
                'banner' => $anime->banner,
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

        return response()->json($animesTransformados);

    }

}

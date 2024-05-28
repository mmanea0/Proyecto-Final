<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Aviso;
use App\Models\BibliotecaAnime;
use App\Models\BibliotecaCapitulo;
use App\Models\CapituloAnime;
use App\Models\Enlace;
use App\Models\Genero;
use App\Models\GeneroAnime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


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

    public function ultimosCapitulosanimesañadidos()
    {
        $ultimosCapitulos = CapituloAnime::with(['anime', 'enlaces'])
            ->orderBy('created_at', 'desc')
            ->take(10) // Ajusta el número de capítulos a devolver según tus necesidades
            ->get();

        return response()->json($ultimosCapitulos);
    }


    public function addCapituloAnime(Request $request, $idanime)
    {
        // Validar los datos del request
        $validated = $request->validate([
            'numero_capitulo' => 'required|integer',
            'sipnosis' => 'nullable|string',
            'duracion' => 'nullable|string',
            'enlaces' => 'required|array',
            'enlaces.*.url' => 'required|url'
        ]);

        // Verificar si el anime existe
        $anime = Anime::find($idanime);
        if (!$anime) {
            return response()->json(['error' => 'Anime not found'], 404);
        }

        // Establecer valores predeterminados si no se proporcionan
        $sipnosis = $validated['sipnosis'] ?? 'vacio';
        $duracion = $validated['duracion'] ?? '0';

        // Verificar si el capítulo ya existe
        $capitulo = CapituloAnime::where('anime_id', $idanime)
            ->where('numero_capitulo', $validated['numero_capitulo'])
            ->first();

        if (!$capitulo) {
            // Crear un nuevo capítulo si no existe
            $capitulo = new CapituloAnime([
                'anime_id' => $idanime,
                'numero_capitulo' => $validated['numero_capitulo'],
                'sipnosis' => $sipnosis,
                'duracion' => $duracion
            ]);
            // Guardar el capítulo
            $anime->capitulos()->save($capitulo);
        } else {
            // Actualizar el capítulo existente
            $capitulo->update([
                'sipnosis' => $sipnosis,
                'duracion' => $duracion
            ]);
        }

        // Actualizar o crear el enlace para el capítulo
        foreach ($validated['enlaces'] as $enlaceData) {
            $enlace = Enlace::updateOrCreate(
                ['capitulo_id' => $capitulo->id],
                ['url' => $enlaceData['url']]
            );
        }

        // Responder con los datos del capítulo y el enlace creado o actualizado
        return response()->json([
            'message' => 'Capítulo y enlace añadido o actualizado correctamente',
            'capitulo' => $capitulo,
            'enlaces' => $capitulo->enlaces
        ], 201);
    }

    public function deleteanime($idanime)
    {
        try {
            // Desactivar restricciones de clave externa temporalmente
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');

            // 1. Eliminar registros en la tabla genero_anime donde aparezca el anime
            GeneroAnime::where('anime_id', $idanime)->delete();

            // 2. Eliminar los registros en la tabla biblioteca_capitulos que hacen referencia a los capítulos del anime
            BibliotecaCapitulo::whereIn('capitulo_id', function ($query) use ($idanime) {
                $query->select('id')->from('capitulos_animes')->where('anime_id', $idanime);
            })->delete();

            // 3. Borrar todos los capítulos del anime de la tabla capitulos_animes
            CapituloAnime::where('anime_id', $idanime)->delete();

            // 4. Eliminar los capítulos relacionados con las tablas enlace y biblioteca_capitulos
            Enlace::whereIn('capitulo_id', function ($query) use ($idanime) {
                $query->select('id')->from('capitulos_animes')->where('anime_id', $idanime);
            })->delete();

            // 5. Eliminar cualquier registro en la tabla biblioteca_anime que tenga el ID del anime
            BibliotecaAnime::where('id_anime', $idanime)->delete();

            // 6. Borrar cualquier registro en la tabla avisos que tenga el ID del anime
            Aviso::where('anime_id', $idanime)->delete();

            // Restablecer restricciones de clave externa
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');

            // Finalmente, eliminar el anime
            Anime::findOrFail($idanime)->delete();

            return response()->json(['message' => 'Anime y registros relacionados eliminados con éxito']);
        } catch (\Exception $e) {
            // Restablecer restricciones de clave externa en caso de error
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


}

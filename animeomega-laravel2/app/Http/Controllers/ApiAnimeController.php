<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\Categoria;
use App\Models\Estado;
use App\Models\Genero;
use App\Models\Season;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class ApiAnimeController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query');

        // Cliente HTTP de Guzzle
        $client = new \GuzzleHttp\Client();
        $response = $client->request('POST', 'https://graphql.anilist.co', [
            'json' => [
                'query' => 'query ($search: String, $page: Int, $perPage: Int) {
                Page(page: $page, perPage: $perPage) {
                    pageInfo {
                        total
                        currentPage
                        lastPage
                        hasNextPage
                    }
                    media(search: $search, type: ANIME) {
                        id
                        title {
                            romaji
                            english
                            native
                        }
                        description
                        startDate {
                            year
                            month
                            day
                        }
                        endDate {
                            year
                            month
                            day
                        }
                        season
                        seasonYear
                        status
                        episodes
                        duration
                        format
                        genres
                        averageScore
                        meanScore
                        siteUrl
                        coverImage {
                            large
                            medium
                        }
                        studios {
                            nodes {
                                name
                            }
                        }
                        bannerImage

                    }
                }
            }',
                'variables' => [
                    'search' => $query,
                    'page' => 1,
                    'perPage' => 30 // Número de resultados por página
                ]
            ]
        ]);

        $data = json_decode($response->getBody()->getContents(), true);

        // Verificar si se encontraron resultados
        if (isset($data['data']['Page']['media'])) {
            return response()->json($data['data']['Page']['media']);
        } else {
            // No se encontraron resultados
            return response()->json([]);
        }
    }

    public function saveAnime(Request $request)
    {
        $animeData = $request->all();

        // Verificar si el anime ya existe en la base de datos
        $animeExistente = Anime::where('nombre_original', $animeData['title']['native'])
            ->orWhere('nombre_en', $animeData['title']['english'])
            ->first();

        // Si el anime ya existe, simplemente retornar ese anime sin guardar uno nuevo
        if ($animeExistente) {
            return response()->json($animeExistente);
        }

        // Crear o encontrar la categoría
        $categoria = Categoria::firstOrCreate(['tipo' => $animeData['format']]);
        // Crear o encontrar el estado
        $estado = Estado::firstOrCreate(['estado' => $animeData['status']]);
        // Crear o encontrar la season
        $season = Season::firstOrCreate(['apoca' => $animeData['season']]);

        // Crear una nueva instancia del modelo Anime
        $anime = new Anime();

        // Llenar los campos del modelo con los datos obtenidos de la API
        $anime->nombre_original = !empty($animeData['title']['native']) ? $animeData['title']['native'] : 'vacio';
        $anime->nombre_en = !empty($animeData['title']['english']) ? $animeData['title']['english'] : 'vacio';
        $anime->nombre_original_sin_kanji = !empty($animeData['title']['romaji']) ? $animeData['title']['romaji'] : 'vacio';
        $anime->foto = !empty($animeData['coverImage']['large']) ? $animeData['coverImage']['large'] : 'vacio';
        $anime->banner = !empty($animeData['bannerImage']) ? $animeData['bannerImage'] : 'vacio';
        $anime->sipnosis = !empty($animeData['description']) ? strip_tags($animeData['description']) : 'vacio';
        $anime->fecha_de_estreno = $animeData['startDate']['year'] . '-' . $animeData['startDate']['month'] . '-' . $animeData['startDate']['day'];
        $anime->estudio_de_animacion = !empty($animeData['studios']['nodes']) ? implode(', ', array_column($animeData['studios']['nodes'], 'name')) : 'vacio';
        $anime->capitulos_totales = !empty($animeData['episodes']) ? $animeData['episodes'] : 0;
        $anime->valoracion = !empty($animeData['averageScore']) ? $animeData['averageScore'] : 0;
        $anime->categoria_id = $categoria->id;
        $anime->estado_id = $estado->id;
        $anime->season_id = $season->id;

        // Guardar el anime en la base de datos
        $anime->save();

        // Asignar los géneros al anime
        if (!empty($animeData['genres'])) {
            $generoIds = [];
            foreach ($animeData['genres'] as $genero) {
                // Aquí se utiliza "firstOrCreate" para crear el género si no existe
                $generoModel = Genero::firstOrCreate(['genero' => $genero]);
                $generoIds[] = $generoModel->id;
            }
            $anime->generos()->sync($generoIds);
        }

        // Retorna una respuesta con el anime guardado
        return response()->json($anime);
    }


}

<?php

namespace App\Http\Controllers;

use App\Models\Anime;
use App\Models\BibliotecaAnime;
use Cassandra\Exception\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MisListasController extends Controller
{
    public function verfavoritosUsuario()
    {
        // Obtener el ID del usuario autenticado
        $userId = auth()->id();

        // Buscar los registros en la tabla biblioteca_anime donde favorito sea verdadero y pertenezcan al usuario actual
        $favoritos = BibliotecaAnime::where('id_usuario', $userId)
            ->where('favorito', 1)
            ->get(['id_anime']);

        // Devolver la lista de IDs de animes favoritos
        return response()->json($favoritos);
    }

    public function agregarfavoritosUsuario(Request $request, $id_anime)
    {
        try {
            // Obtener el ID del usuario autenticado
            $userId = auth()->id();
            if (!Anime::where('id', $id_anime)->exists()) {
                return response()->json(['message' => 'El anime no existe.'], 404);
            }
            $bibliotecaAnime = BibliotecaAnime::where('id_usuario', $userId)
                ->where('id_anime', $id_anime)
                ->first();
            if ($bibliotecaAnime) {
                // Actualizar el campo favorito a verdadero
                $bibliotecaAnime->favorito = true;
                $bibliotecaAnime->save();
            } else {
                $estadoId = 1;
                BibliotecaAnime::create([
                    'id_usuario' => $userId,
                    'id_anime' => $id_anime,
                    'favorito' => true,
                    'estado_id' => $estadoId
                ]);
            }
            return response()->json(['message' => 'Anime añadido a favoritos'], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al añadir el anime a favoritos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function agregarsiguiendo(Request $request, $id_anime)
    {
        return $this->agregarAnime($id_anime, false, 1);
    }

    public function agregarpendiente(Request $request, $id_anime)
    {
        return $this->agregarAnime($id_anime, false, 2);
    }

    public function agregarcompleado(Request $request, $id_anime)
    {
        return $this->agregarAnime($id_anime, false, 3);
    }

    public function agregarabandonado(Request $request, $id_anime)
    {
        return $this->agregarAnime($id_anime, false, 4);
    }

    private function agregarAnime($id_anime, $favorito, $estadoId)
    {
        try {
            // Obtener el ID del usuario autenticado
            $userId = auth()->id();

            // Validar que el 'id_anime' pasado en la URL existe en la tabla 'animes'
            if (!Anime::where('id', $id_anime)->exists()) {
                return response()->json(['message' => 'El anime no existe.'], 404);
            }

            // Buscar el registro en la tabla biblioteca_anime
            $bibliotecaAnime = BibliotecaAnime::where('id_usuario', $userId)
                ->where('id_anime', $id_anime)
                ->first();

            if ($bibliotecaAnime) {
                // Si el registro ya existe, actualizar el estado del anime
                $bibliotecaAnime->update(['estado_id' => $estadoId]);
            } else {
                // Crear un nuevo registro en la tabla biblioteca_anime
                BibliotecaAnime::create([
                    'id_usuario' => $userId,
                    'id_anime' => $id_anime,
                    'favorito' => $favorito,
                    'estado_id' => $estadoId
                ]);
            }

            // Devolver un mensaje de éxito
            return response()->json(['message' => 'Estado del anime actualizado'], 200);

        } catch (ValidationException $e) {
            // Capturar errores de validación y devolver una respuesta con código 422
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);

        } catch (Exception $e) {
            // Capturar cualquier otro error y devolver una respuesta con código 500
            return response()->json([
                'message' => 'Error al actualizar el estado del anime',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function animesdelusuario(Request $request)
    {
        try {
            // Obtener el ID del usuario autenticado
            $userId = Auth::id();

            // Obtener el ID del estado de los animes que se desean obtener (si se proporciona en la solicitud)
            $estadoId = $request->input('estado_id');

            // Construir la consulta para obtener los animes de la biblioteca del usuario
            $query = BibliotecaAnime::select('animes.*')
                ->join('animes', 'biblioteca_anime.id_anime', '=', 'animes.id')
                ->where('biblioteca_anime.id_usuario', $userId);

            // Si se proporciona el ID del estado, filtrar por ese estado
            if ($estadoId !== null) {
                $query->where('biblioteca_anime.estado_id', $estadoId);
            }

            // Ejecutar la consulta y obtener los resultados
            $bibliotecaAnime = $query->get();

            // Devolver la lista de animes en la biblioteca del usuario
            return response()->json($bibliotecaAnime, 200);

        } catch (Exception $e) {
            // Capturar cualquier error y devolver una respuesta con código 500
            return response()->json([
                'message' => 'Error al obtener la biblioteca de animes del usuario',
                'error' => $e->getMessage()
            ], 500);
        }

    }

    public function eliminarFavorito(Request $request, $id_anime)
    {
        try {
            // Obtener el ID del usuario autenticado
            $userId = auth()->id();

            // Buscar el registro en la tabla biblioteca_anime
            $bibliotecaAnime = BibliotecaAnime::where('id_usuario', $userId)
                ->where('id_anime', $id_anime)
                ->first();

            // Si el registro no existe, devolver un mensaje de error
            if (!$bibliotecaAnime) {
                return response()->json(['message' => 'El anime no está en favoritos'], 404);
            }

            $bibliotecaAnime->favorito = false;
            $bibliotecaAnime->save();

            return response()->json(['message' => 'Anime eliminado de favoritos'], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el anime de favoritos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function mostarUnFavorito($id_anime) {
        try {
            $userId = auth()->id();
            $bibliotecaAnime = BibliotecaAnime::where('id_usuario', $userId)
                ->where('id_anime', $id_anime)
                ->first();
            if (!$bibliotecaAnime) {
                return response()->json(['favorito' => false], 200);
            }
            return response()->json(['favorito' => $bibliotecaAnime->favorito], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener el estado favorito del anime',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}

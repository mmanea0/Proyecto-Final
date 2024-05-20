<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Anime;
use App\Models\AuthDiscord;
use App\Models\BibliotecaAnime;
use App\Models\Role;
use Cassandra\Exception\ValidationException;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function loginDiscord()
    {
        return Socialite::driver('discord')->redirect();
    }



    public function store()
    {
        // Obtener los datos del usuario de Discord
        $discordUser = Socialite::driver('discord')->user();

        // Buscar si el usuario ya existe en la base de datos por su discord_id
        $user = User::where('discord_id', $discordUser->id)->first();

        // Si el usuario no existe, crear uno nuevo
        if (!$user) {
            $user = new User();
        }
        // Extraer los campos que deseas guardar
        $user->name = $discordUser->name;
        $user->email = $discordUser->email;
        $user->discord_id = $discordUser->id;
        $user->nickname = $discordUser->nickname;
        $user->avatar = $discordUser->avatar;
        $user->save();

        $roleUser = Role::where('id', 1)->first();
        // Asignar el rol al usuario
        if ($roleUser) {
            // Asignar el rol al usuario
            $user->roles()->attach($roleUser);
        } else {
            throw new \Exception('El rol ROLE_USER no existe en la base de datos.');
        }
        // Autentica al usuario de Laravel
        Auth::login($user);

        // Crea el token de acceso personal para el usuario autenticado
        // Crea el token de acceso personal para el usuario autenticado
        $token = $user->createToken('token-name')->accessToken;
        $nickname = $user->nickname;
        $avatar = $user->avatar; // Suponiendo que $user->avatar contiene la URL del avatar
        $rol = $user->roleNames()[0]; // Asigna el único rol del usuario
        return redirect()->to('http://localhost:4200/login-callback/?access_token='.$token.'&nickname='.$nickname.'&avatar='.$avatar.'&rol='.$rol);


    }

    public function register(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'nickname' => $request->nickname,
            'imagen' => $request->imagen
        ]);
        // Obtener el ID del rol ROLE_USER
        $roleUser = Role::where('id', 1)->first();

        // Asignar el rol al usuario
        if ($roleUser) {
            // Asignar el rol al usuario
            $user->roles()->attach($roleUser);
        } else {
            throw new \Exception('El rol ROLE_USER no existe en la base de datos.');
        }
        $token = $user->createToken('token-name');
        return response()->json([
            'access_token' => $token->accessToken,
            'token_type' => 'Bearer',
            'name' => $user->name,
        ]);
    }


    public function iniciodesesion(Request $request)
    {

        $credentials = $request->validate([
                'nickname' => 'required|string',
                'password' => 'required|string'
            ]);
        if (Auth::attempt($credentials)) {
            $token = Auth::user()->createToken('token-name');
            return response()->json([
                'access_token' => $token->accessToken,
                'token_type' => 'Bearer',
                'nickname' => Auth::user()->nickname,
                'roles' => Auth::user()->roleNames(),
                'avatar' => Auth::user()->avatar,
            ]);
        }

        return response()->json(['message' => 'Credenciales inválidas'], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json(['mensaje' => 'Sesión cerrada']);
    }

    public function info(Request $request)
    {
       return response()->json([
            'nickname' => Auth::user()->nickname,
            'avatar' => Auth::user()->avatar,
            'roles' => Auth::user()->roleNames()
        ]);
    }

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
}

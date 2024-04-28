<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AuthDiscord;
use App\Models\Role;
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
        // Autentica al usuario de Laravel
        Auth::login($user);

        // Crea el token de acceso personal para el usuario autenticado
        $token = $user->createToken('token-name')->accessToken;

/*        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user' => $user,
            'access_token' => $token // Devuelve el token de acceso personal como parte de la respuesta JSON
        ]);*/

        // Redirige al frontend con el token de acceso personal
        return redirect()->to('http://localhost:4200/login-callback/?access_token='.$token);
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
                'roles' => Auth::user()->roleNames()
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
            'roles' => Auth::user()->roleNames()
        ]);
    }


}

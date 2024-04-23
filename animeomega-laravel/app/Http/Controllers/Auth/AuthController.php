<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AuthDiscord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;

class AuthController extends Controller
{
    public function login()
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

        // Intenta autenticar al usuario de Laravel usando su ID de Discord
        /*        $authDiscordUser = AuthDiscord::where('discord_id', $discordUser->id)->first();*/

        /* // Si el usuario no está autenticado, crea una nueva instancia de AuthDiscord
         if (!$authDiscordUser) {
             $authDiscordUser = new AuthDiscord($userData);
             $authDiscordUser->save();
         }*/

        $user->save();
        // Autentica al usuario de Laravel
        Auth::login($user);

        // Crea el token de acceso personal para el usuario autenticado
        $token = $user->createToken('token-name')->accessToken;

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user' => $user,
            'access_token' => $token // Devuelve el token de acceso personal como parte de la respuesta JSON
        ]);

        // Redirige al frontend con el token de acceso personal
        // return redirect()->to('http://localhost:4200/login-callback/?access_token='.$token);
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json(['mensaje' => 'Sesión cerrada']);
    }

    public function show()
    {
        //muestra todos los usuarios
        return response()->json(AuthDiscord::all());
    }
}

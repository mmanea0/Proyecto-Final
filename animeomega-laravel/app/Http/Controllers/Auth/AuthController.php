<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AuthDiscord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

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

        // Extraer los campos que deseas guardar
        $userData = [
            'discord_id' => $discordUser->id,
            'nickname' => $discordUser->nickname,
            'name' => $discordUser->name,
            'email' => $discordUser->email,
            'avatar' => $discordUser->avatar
        ];

        // Intenta autenticar al usuario de Laravel usando su ID de Discord
        $authDiscordUser = AuthDiscord::where('discord_id', $discordUser->id)->first();

        // Si el usuario no está autenticado, crea una nueva instancia de AuthDiscord
        if (!$authDiscordUser) {
            $authDiscordUser = new AuthDiscord($userData);
            $authDiscordUser->save();
        }

        // Autentica al usuario de Laravel
        Auth::login($authDiscordUser);

        // Crea el token de acceso personal para el usuario autenticado
        $token = Auth::user()->createToken('token-name')->plainTextToken;

        // Redirige al frontend con el token de acceso personal
        return redirect()->to('http://localhost:4200/login-callback/?access_token='.$token);
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

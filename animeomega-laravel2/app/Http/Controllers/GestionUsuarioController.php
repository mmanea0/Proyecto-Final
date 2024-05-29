<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class GestionUsuarioController extends Controller
{
    public function vertodoslosusuarios()
    {

        // Seleccionar solo los campos requeridos
        $usuarios = User::select('id','name', 'email', 'discord_id', 'nickname', 'avatar')->get();

        // Devolver la respuesta JSON con los usuarios seleccionados
        return response()->json($usuarios);
    }



    public function eliminarUsuario($idusuario)
    {
        // Obtener el usuario autenticado
        $usuarioAutenticado = Auth::user();

        // Si el usuario autenticado tiene el mismo ID que el usuario que se intenta eliminar, no permitir la eliminación y devolver un mensaje de error
        if ($usuarioAutenticado->id === $idusuario) {
            return response()->json(['error' => 'No puedes eliminar tu propio usuario'], 403); // 403 Forbidden
        }

        $usuario = User::find($idusuario);

        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar la presencia del ID del usuario en otras tablas y eliminar los registros asociados

        // Eliminar el usuario de la tabla roles_usuarios si existe
        DB::table('roles_usuarios')->where('user_id', $idusuario)->delete();

        // Eliminar el usuario de la tabla biblioteca_anime si existe
        DB::table('biblioteca_anime')->where('id_usuario', $idusuario)->delete();

        // Eliminar el usuario de la tabla biblioteca_capitulos si existe
        DB::table('biblioteca_capitulos')->where('usuario_id', $idusuario)->delete();

        // Eliminar el usuario de la tabla avisos si existe
        DB::table('avisos')->where('usuario_id', $idusuario)->delete();

        // Eliminar el usuario de la base de datos
        $usuario->delete();

        // Devolver la respuesta JSON con un mensaje de éxito
        return response()->json(['message' => 'Usuario eliminado con éxito']);
    }


}

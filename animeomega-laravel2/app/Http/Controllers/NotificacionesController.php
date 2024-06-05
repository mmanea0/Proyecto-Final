<?php

namespace App\Http\Controllers;

use App\Models\Aviso;
use Illuminate\Http\Request;

class NotificacionesController extends Controller
{
    public function mostrarNotificacionesUsuario()
    {
        $userId = auth()->id();
        $notificacionesNoLeidas = Aviso::where('usuario_id', $userId)
            ->where('leido', false)
            ->with('anime', 'tipoAviso')
            ->get();


        if ($notificacionesNoLeidas->isEmpty()) {
            return response()->json([]);
        }

        return response()->json($notificacionesNoLeidas);
    }

    public function marcarNotificacionComoLeida(Request $request, $id)
    {
        $userId = auth()->id();
        $notificacion = Aviso::where('usuario_id', $userId)
            ->where('id', $id)
            ->first();

        if (!$notificacion) {
            return response()->json(['message' => 'Notificación no encontrada'], 404);
        }

        $notificacion->leido = true;
        $notificacion->save();

        return response()->json(['message' => 'Notificación marcada como leída'], 200);
    }

    public function notificacionesleidotodas()
    {
        $userId = auth()->id();

        // Buscar todas las notificaciones no leídas del usuario
        $notificacionesNoLeidas = Aviso::where('usuario_id', $userId)
            ->where('leido', false)
            ->get();

        // Marcar todas las notificaciones como leídas
        foreach ($notificacionesNoLeidas as $notificacion) {
            $notificacion->leido = true;
            $notificacion->save();
        }

        return response()->json(['message' => 'Todas las notificaciones marcadas como leídas'], 200);
    }

    public function animeestreno($animeId)
    {
        $userId = auth()->id();

        // Buscar aviso existente con las mismas condiciones
        $avisoExistente = Aviso::where('usuario_id', $userId)
            ->where('anime_id', $animeId)
            ->where('tipo_aviso_id', 2)
            ->first();

        // Si existe un aviso con las mismas condiciones, elimínalo
        if ($avisoExistente) {
            $avisoExistente->delete();
            return response()->json(['message' => 'Notificación de estreno eliminada'], 200);
        } else {
            // Si no existe un aviso con las mismas condiciones, crea uno nuevo
            $aviso = new Aviso();
            $aviso->usuario_id = $userId;
            $aviso->anime_id = $animeId;
            $aviso->leido = false;
            $aviso->mensaje = "!Nuevo estreno¡";
            $aviso->tipo_aviso_id = 2;

            $aviso->save();
            return response()->json(['message' => 'Notificación de estreno creada'], 201);
        }
    }



}

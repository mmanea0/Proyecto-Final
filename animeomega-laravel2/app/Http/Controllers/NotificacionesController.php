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





}

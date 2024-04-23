<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public function prueba1()
    {
        return response()->json(['mensaje' => 'Aceso permitido a prueba1 (publico)']);
    }
}

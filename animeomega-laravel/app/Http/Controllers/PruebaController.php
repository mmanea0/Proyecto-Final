<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PruebaController extends Controller
{
    public function prueba1()
    {
        return response()->json(['mensaje' => 'Aceso permitido a prueba1 (publico)']);
    }
}

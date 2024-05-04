<?php

namespace App\Http\Controllers;

abstract class Controller
{
    function prueba()
    {
        return response()->json(['message' => 'Hello World!'], 200);
    }
}

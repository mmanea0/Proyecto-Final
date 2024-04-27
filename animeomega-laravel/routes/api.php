<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\PruebaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas de autenticación
Route::middleware('web')->group(function () {
    Route::get('/logindiscord', [AuthController::class, 'loginDiscord']);
    Route::get('/auth/callback', [AuthController::class, 'store']);
});

Route::post('/iniciosesion', [AuthController::class, 'iniciodesesion']);
Route::post('/register', [AuthController::class, 'register']);

Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/usuario', [AuthController::class, 'show']);


// Otras rutas protegidas por autenticación
Route::middleware('auth:api')->group(function () {
    // Ruta para obtener el usuario autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Otras rutas protegidas...
});

// Otras rutas públicas
//Route::get('/prueba', [PruebaController::class, 'prueba1']);





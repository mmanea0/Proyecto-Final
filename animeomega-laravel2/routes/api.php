<?php

use App\Http\Controllers\AnimesController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Rutas de autenticación
Route::middleware('web')->group(function () {
    Route::get('/logindiscord', [AuthController::class, 'loginDiscord']);
    Route::get('/auth/callback', [AuthController::class, 'store']);
});

Route::post('/iniciosesion', [AuthController::class, 'iniciodesesion']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/iniciosesion/info',[AuthController::class,'info'])->middleware('auth:api');


Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/usuario', [AuthController::class, 'show']);
Route::get('/anime/id/{id}', [AnimesController::class, 'show']);
Route::get('anime/{animeId}/capitulos/{capituloId}', [AnimesController::class, 'enlacesCapitulo']);

Route::get('/anime', [AnimesController::class, 'getAnimes']);
Route::get('/anime/{anime}', [AnimesController::class, 'findAnime']);
Route::get('/prueba', [AnimesController::class, 'prueba']);
Route::get('/anime/genero/{genero}', [AnimesController::class, 'findGenero']);
Route::get('/ultimosanimes', [AnimesController::class, 'ultimosanimesañadidos']);




// Otras rutas protegidas por autenticación
Route::middleware('auth:api')->group(function () {
    // Ruta para obtener el usuario autenticado

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/favoritos', [AuthController::class, 'verfavoritosUsuario']);

    Route::post('/agregarfavorito/{id_anime}',[AuthController::class, 'agregarfavoritosUsuario']);
    Route::post('/agregarpendiente/{id_anime}',[AuthController::class, 'agregarpendiente']);
    Route::post('/agregarsiguiendo/{id_anime}',[AuthController::class, 'agregarsiguiendo']);
    Route::post('/agregarcompleado/{id_anime}',[AuthController::class, 'agregarcompleado']);
    Route::post('/agregarabandonado/{id_anime}',[AuthController::class, 'agregarabandonado']);
    Route::get('/biblioteca', [AuthController::class, 'animesdelusuario']);

});




// Otras rutas públicas
//Route::get('/prueba', [PruebaController::class, 'prueba1']);


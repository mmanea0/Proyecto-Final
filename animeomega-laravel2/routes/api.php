<?php

use App\Http\Controllers\AnimesController;
use App\Http\Controllers\ApiAnimeController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\EstadisticasController;
use App\Http\Controllers\GestionUsuarioController;
use App\Http\Controllers\MisListasController;
use App\Http\Controllers\NotificacionesController;
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
//Route::get('/prueba', [AnimesController::class, 'prueba']);
Route::get('/searcher', [AnimesController::class, 'searcher']);
Route::get('/ultimoscapitulos', [AnimesController::class, 'ultimosCapitulosanimesañadidos']);

Route::post('/api-search', [ApiAnimeController::class, 'search']);
Route::post('/save-anime', [ApiAnimeController::class, 'saveAnime']);
Route::post('/addcapituloanime/{id_anime}',[AnimesController::class, 'addCapituloAnime']);

Route::get('/futurosanimes/{mes}', [AnimesController::class, 'futurosanimes']);
Route::get('/getgeneros', [AnimesController::class, 'getgeneros']);
Route::get('/getanno', [AnimesController::class, 'getanno']);
Route::get('/getcategoria', [AnimesController::class, 'getcategoria']);
Route::get('/getestado', [AnimesController::class, 'getestado']);
Route::get('/getordenar', [AnimesController::class, 'getordenar']);


// Otras rutas protegidas por autenticación
Route::middleware('auth:api')->group(function () {

    Route::get('/usuarioquemasanimeavisualizado', [EstadisticasController::class, 'usuarioquemasanimesavisto'])->middleware('can:admin-access');
    Route::get('/contadorcompletados', [EstadisticasController::class, 'aniemesCompletados'])->middleware('can:admin-access');
    Route::get('/contadorabandonados', [EstadisticasController::class, 'animesAbandonados'])->middleware('can:admin-access');
    Route::get('/generosmasvistos', [EstadisticasController::class, 'generosmasvistos'])->middleware('can:admin-access');
    Route::get('/contarfasvoritos', [EstadisticasController::class, 'animesfavoritos'])->middleware('can:admin-access');

    Route::get('/usuarios', [GestionUsuarioController::class, 'vertodoslosusuarios'])->middleware('can:admin-access');
    Route::post('/eliminarusuario/{idusuario}', [GestionUsuarioController::class, 'eliminarUsuario'])->middleware('can:admin-access');

    // Ruta para obtener el usuario autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/favoritos', [MisListasController::class, 'verfavoritosUsuario']);

    Route::post('/agregarfavorito/{id_anime}',[MisListasController::class, 'agregarfavoritosUsuario']);
    Route::post('/eliminarFavorito/{id_anime}',[MisListasController::class, 'eliminarFavorito']);
    Route::get('/favorito/{id_anime}', [MisListasController::class, 'mostarUnFavorito']);

    Route::post('/agregarpendiente/{id_anime}',[MisListasController::class, 'agregarpendiente']);
    Route::post('/agregarsiguiendo/{id_anime}',[MisListasController::class, 'agregarsiguiendo']);
    Route::post('/agregarcompleado/{id_anime}',[MisListasController::class, 'agregarcompleado']);
    Route::post('/agregarabandonado/{id_anime}',[MisListasController::class, 'agregarabandonado']);
    Route::get('/biblioteca', [MisListasController::class, 'animesdelusuario']);
    Route::post('/marcarvisto/{id_capitulo}',[MisListasController::class, 'marcarepisodiocomovisto']);
    Route::get('/capitulosvisto/{id_capitulo}',[MisListasController::class, 'capitulosvistos']);

    Route::post('/quitaranime/{id_anime}',[AnimesController::class, 'deleteanime']);

    Route::get('/notificaciones', [NotificacionesController::class, 'mostrarNotificacionesUsuario']);
    Route::post('/notificacionesleido/{id}/', [NotificacionesController::class, 'marcarNotificacionComoLeida']);
    Route::post('/notificacionesleidotodas', [NotificacionesController::class, 'notificacionesleidotodas']);
});




// Otras rutas públicas
//Route::get('/prueba', [PruebaController::class, 'prueba1']);


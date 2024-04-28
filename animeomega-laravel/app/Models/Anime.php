<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Anime extends Model
{
    use HasFactory;
protected $table = 'animes';
    protected $fillable = ['nombre_original', 'nombre_en', 'nombre_original_sin_kanji',
        'foto', 'sipnosis', 'fecha_de_estreno', 'estudio_de_animacion', 'capitulos_totales',
        'valoracion', 'categoria_id', 'estado_id', 'season_id'];

    public function generos()
    {
        return $this->belongsToMany(Genero::class, 'generos_animes', 'anime_id', 'genero_id');
    }
}

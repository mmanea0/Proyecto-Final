<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CapituloAnime extends Model
{
    protected $table = 'capitulos_animes';
    protected $fillable = ['anime_id', 'numero_capitulo', 'sipnosis', 'duracion'];
    use HasFactory;


    public function anime()
    {
        return $this->belongsTo(Anime::class, 'anime_id');
    }
}

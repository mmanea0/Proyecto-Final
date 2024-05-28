<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeneroAnime extends Model
{
    use HasFactory;
    protected $table = 'generos_animes';
    protected $fillable = ['anime_id', 'genero_id'];

    public function animes()
    {
        return $this->belongsToMany(Anime::class, 'animes', 'anime_id', 'genero_id');
    }

    public function generos()
    {
        return $this->belongsToMany(Genero::class, 'generos', 'anime_id', 'genero_id');
    }
}

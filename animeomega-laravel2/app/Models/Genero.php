<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Genero extends Model
{
    use HasFactory;
    protected $table = 'generos';
    protected $fillable = ['genero'];

    public function animes()
    {
        return $this->belongsToMany(Anime::class, 'generos_animes', 'genero_id', 'anime_id');
    }
}

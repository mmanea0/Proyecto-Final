<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BibliotecaAnime extends Model
{
    protected $table = 'biblioteca_anime';
    protected $fillable = ['id_anime', 'id_usuario', 'favorito', 'estado_id'];

    use HasFactory;
}

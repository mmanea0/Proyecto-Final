<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeneroAnime extends Model
{
    use HasFactory;
    protected $table = 'genero_anime';
    protected $fillable = ['anime_id', 'genero_id'];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BibliotecaCapitulo extends Model
{
    use HasFactory;
    protected $table = 'biblioteca_capitulos';
    protected $fillable = ['capitulo_id', 'usuario_id', 'visto'];

    public function capitulo()
    {
        return $this->belongsTo(CapituloAnime::class, 'capitulo_id');
    }
}

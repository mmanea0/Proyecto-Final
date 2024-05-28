<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aviso extends Model
{
    use HasFactory;
    protected $table = 'avisos';
    protected $fillable = ['usuario_id', 'anime_id', 'mensaje', 'leido','tipo_aviso_id'];

    public function usuario()
    {
        return $this->belongsTo(User::class);
    }
    public function anime()
    {
        return $this->belongsTo(Anime::class);
    }
    public function tipoAviso()
    {
        return $this->belongsTo(TipoAviso::class);
    }
}

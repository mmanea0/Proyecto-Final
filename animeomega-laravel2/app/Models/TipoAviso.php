<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoAviso extends Model
{
    use HasFactory;
    protected $table = 'tipo_avisos';
    protected $fillable = ['tipo'];
}

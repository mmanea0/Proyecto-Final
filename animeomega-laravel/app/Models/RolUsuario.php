<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RolUsuario extends Model
{
    use HasFactory;
    protected $table = 'rol_usuario';
    protected $fillable = ['rol_id', 'usuario_id'];
}

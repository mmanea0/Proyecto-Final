<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enlace extends Model
{
    protected $table = 'enlace';
    protected $fillable = ['url', 'capitulo_id'];
    use HasFactory;



}

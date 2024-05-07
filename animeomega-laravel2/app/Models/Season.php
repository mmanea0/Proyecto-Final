<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    protected $table = 'seasons';
    protected $fillable = ['apoca'];
    use HasFactory;
}

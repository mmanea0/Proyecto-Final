<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuthProvider extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'login_at' => 'datetime',
    ];
}

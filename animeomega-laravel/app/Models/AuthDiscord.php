<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class AuthDiscord extends Model
{
    use HasFactory;
    protected $table = 'auth_discord';
    protected $fillable = ['discord_id', 'nickname', 'name', 'email', 'avatar'];

}

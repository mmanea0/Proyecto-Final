<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('generos_animes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('genero_id')->references('id')->on('generos');
            $table->foreignId('anime_id')->references('id')->on('animes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generos_animes');
    }
};

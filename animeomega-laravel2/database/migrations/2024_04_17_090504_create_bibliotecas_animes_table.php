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
        Schema::create('biblioteca_anime', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_anime')->references('id')->on('animes');
            $table->foreignId('id_usuario')->references('id')->on('users');
            $table->boolean('favorito');
            $table->foreignId('estado_id')->references('id')->on('estados_bibliotecas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biblioteca_anime');
    }
};

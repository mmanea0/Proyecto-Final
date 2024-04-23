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
        Schema::create('animes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_original');
            $table->string('nombre_en');
            $table->string('nombre_original_sin_kanji');
            $table->string('foto');
            $table->text('sipnosis');
            $table->timestamp('fecha_de_estreno');
            $table->string('estudio_de_animacion');
            $table->integer('capitulos_totales');
            $table->float('valoracion');
            $table->foreignId('categoria_id')->references('id')->on('categorias');
            $table->foreignId('estado_id')->references('id')->on('estados');
            $table->foreignId('season_id')->references('id')->on('seasons');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('animes');
    }
};

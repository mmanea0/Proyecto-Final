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
        Schema::create('capitulos_animes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('anime_id')->references('id')->on('animes');
            $table->integer('numero_capitulo');
            $table->string('sipnosis');
            $table->integer('duracion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capitulos_anime');
    }
};

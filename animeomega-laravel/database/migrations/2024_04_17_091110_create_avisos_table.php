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
        Schema::create('avisos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->references('id')->on('users');
            $table->foreignId('anime_id')->references('id')->on('animes');
            $table->text('mensaje');
            $table->boolean('leido');
            $table->foreignId('tipo_aviso_id')->references('id')->on('tipo_avisos');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('avisos');
    }
};

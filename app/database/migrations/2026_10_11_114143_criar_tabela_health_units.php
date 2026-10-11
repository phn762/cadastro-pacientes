<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Cria a tabela de unidades de saúde.
     */
    public function up(): void
    {
        Schema::create('health_units', function (Blueprint $tabela) {
            $tabela->id();
            $tabela->string('name');
            $tabela->string('city');
            $tabela->timestamps();
        });
    }

    /**
     * Desfaz a criação da tabela de unidades de saúde.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_units');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Cria a tabela de pacientes vinculados a unidades de saúde.
     */
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $tabela) {
            $tabela->id();
            $tabela->string('name');
            $tabela->char('cpf', 11)->unique();
            $tabela->date('birth_date');
            $tabela->string('phone', 20)->nullable();
            $tabela->foreignId('health_unit_id')
                ->constrained('health_units')
                ->restrictOnDelete();
            $tabela->timestamps();
        });
    }

    /**
     * Desfaz a criação da tabela de pacientes.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};

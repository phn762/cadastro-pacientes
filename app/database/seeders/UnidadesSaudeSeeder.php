<?php

namespace Database\Seeders;

use App\Models\UnidadeSaude;
use Illuminate\Database\Seeder;

class UnidadesSaudeSeeder extends Seeder
{
    public function run(): void
    {
        $unidades = [
            ['name' => 'UBS Centro', 'city' => 'Piracicaba'],
            ['name' => 'UBS Vila', 'city' => 'Piracicaba'],
            ['name' => 'UBS Jardim', 'city' => 'Piracicaba'],
        ];

        foreach ($unidades as $unidade) {
            UnidadeSaude::firstOrCreate($unidade);
        }
    }
}

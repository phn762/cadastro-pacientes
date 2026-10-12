<?php

namespace Database\Seeders;

use App\Models\Paciente;
use App\Models\UnidadeSaude;
use Illuminate\Database\Seeder;

class PacientesSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(UnidadesSaudeSeeder::class);

        $unidades = UnidadeSaude::where('city', 'Piracicaba')
            ->whereIn('name', ['UBS Centro', 'UBS Vila', 'UBS Jardim'])
            ->orderBy('id')->get();

        $nomes = [
            'Ana Silva', 'Bruno Santos', 'Carla Oliveira', 'Diego Souza', 'Elaine Costa',
            'Felipe Almeida', 'Gabriela Lima', 'Henrique Rocha', 'Isabela Martins', 'Lucas Pereira',
            'Mariana Alves', 'Nicolas Ribeiro', 'Olivia Fernandes', 'Pedro Nunes', 'Renata Barbosa',
        ];

        foreach ($nomes as $indice => $nome) {
            $cpf = '9000000'.str_pad((string) ($indice + 1), 4, '0', STR_PAD_LEFT);

            Paciente::firstOrCreate(['cpf' => $cpf], [
                'name' => $nome,
                'birth_date' => '1995-05-20',
                'phone' => null,
                'health_unit_id' => $unidades[$indice % $unidades->count()]->id,
            ]);
        }
    }
}

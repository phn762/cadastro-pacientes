<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Executa os seeders da aplicação.
     */
    public function run(): void
    {
        $this->call(UnidadesSaudeSeeder::class);
    }
}

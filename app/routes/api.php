<?php

use App\Http\Controllers\PacienteController;
use App\Http\Controllers\UnidadeSaudeController;
use Illuminate\Support\Facades\Route;

Route::get('/health-units', [UnidadeSaudeController::class, 'listar']);
Route::get('/patients', [PacienteController::class, 'listar']);
Route::post('/patients', [PacienteController::class, 'cadastrar']);
Route::get('/patients/{paciente}', [PacienteController::class, 'consultar'])->whereNumber('paciente');
Route::put('/patients/{paciente}', [PacienteController::class, 'atualizar'])->whereNumber('paciente');
Route::delete('/patients/{paciente}', [PacienteController::class, 'excluir'])->whereNumber('paciente');

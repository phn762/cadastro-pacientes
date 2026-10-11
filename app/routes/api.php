<?php

use App\Http\Controllers\UnidadeSaudeController;
use Illuminate\Support\Facades\Route;

Route::get('/health-units', [UnidadeSaudeController::class, 'listar']);

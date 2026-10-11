<?php

namespace App\Http\Controllers;

use App\Models\UnidadeSaude;
use Illuminate\Http\JsonResponse;

class UnidadeSaudeController extends Controller
{
    public function listar(): JsonResponse
    {
        $unidades = UnidadeSaude::orderBy('name')->get(['id', 'name', 'city']);

        return response()->json($unidades);
    }
}

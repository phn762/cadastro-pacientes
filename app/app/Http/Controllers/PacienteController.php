<?php

namespace App\Http\Controllers;

use App\Http\Requests\AtualizarPacienteRequest;
use App\Http\Requests\CadastrarPacienteRequest;
use App\Models\Paciente;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PacienteController extends Controller
{
    public function cadastrar(CadastrarPacienteRequest $requisicao): JsonResponse
    {
        $paciente = Paciente::create($requisicao->validated());

        return response()->json($paciente->refresh()->load('unidadeSaude'), 201);
    }

    public function listar(Request $requisicao): JsonResponse
    {
        $filtros = $requisicao->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ], [
            'search.string' => 'A busca deve ser um texto.',
            'search.max' => 'A busca deve ter no máximo 255 caracteres.',
            'page.integer' => 'A página deve ser um número inteiro.',
            'page.min' => 'A página deve ser pelo menos 1.',
        ]);

        $busca = trim($filtros['search'] ?? '');
        $consulta = Paciente::with('unidadeSaude')->orderBy('name')->orderBy('id');

        if ($busca !== '') {
            $consulta->where('name', 'like', '%'.$busca.'%');
        }

        return response()->json($consulta->paginate(10)->withQueryString());
    }

    public function consultar(Paciente $paciente): JsonResponse
    {
        return response()->json($paciente->load('unidadeSaude'));
    }

    public function atualizar(AtualizarPacienteRequest $requisicao, Paciente $paciente): JsonResponse
    {
        $paciente->update($requisicao->validated());

        return response()->json($paciente->refresh()->load('unidadeSaude'));
    }

    public function excluir(Paciente $paciente): Response
    {
        $paciente->delete();

        return response()->noContent();
    }
}

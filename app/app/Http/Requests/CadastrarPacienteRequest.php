<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CadastrarPacienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'regex:/^(?=.*\p{L})[\p{L}\p{M} \'\x{2019}-]+$/u'],
            'cpf' => ['required', 'string', 'regex:/^[0-9]{11}$/', 'unique:patients,cpf'],
            'birth_date' => ['required', 'date_format:Y-m-d', 'before_or_equal:today'],
            'phone' => ['nullable', 'string', 'regex:/^(?:[0-9]{8}|[0-9]{10,11})$/'],
            'health_unit_id' => ['required', 'integer', 'exists:health_units,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'O campo :attribute é obrigatório.',
            'string' => 'O campo :attribute deve ser um texto.',
            'max.string' => 'O campo :attribute deve ter no máximo :max caracteres.',
            'name.regex' => 'O nome deve conter apenas letras, espaços, hífen e apóstrofo.',
            'cpf.regex' => 'O CPF deve conter exatamente 11 dígitos numéricos.',
            'cpf.unique' => 'Este CPF já está cadastrado.',
            'birth_date.date_format' => 'A data de nascimento deve estar no formato AAAA-MM-DD.',
            'birth_date.before_or_equal' => 'A data de nascimento não pode ser futura.',
            'phone.regex' => 'O telefone deve conter 8, 10 ou 11 números.',
            'health_unit_id.integer' => 'Selecione uma unidade de saúde válida.',
            'health_unit_id.exists' => 'A unidade de saúde informada não existe.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nome',
            'cpf' => 'CPF',
            'birth_date' => 'data de nascimento',
            'phone' => 'telefone',
            'health_unit_id' => 'unidade de saúde',
        ];
    }
}

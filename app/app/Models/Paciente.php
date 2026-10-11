<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paciente extends Model
{
    protected $table = 'patients';

    protected $fillable = [
        'name',
        'cpf',
        'birth_date',
        'phone',
        'health_unit_id',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date:Y-m-d',
        ];
    }

    public function unidadeSaude(): BelongsTo
    {
        return $this->belongsTo(UnidadeSaude::class, 'health_unit_id');
    }
}

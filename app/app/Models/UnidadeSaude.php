<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UnidadeSaude extends Model
{
    protected $table = 'health_units';

    protected $fillable = [
        'name',
        'city',
    ];

    public function pacientes(): HasMany
    {
        return $this->hasMany(Paciente::class, 'health_unit_id');
    }
}

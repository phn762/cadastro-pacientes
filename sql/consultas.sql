-- Query de listagem de pacientes e unidades
SELECT patients.name AS paciente, health_units.name AS unidade
FROM patients
JOIN health_units ON patients.health_unit_id = health_units.id;

-- Query de contagem de pacientes por unidade
SELECT health_units.name AS unidade, COUNT(patients.id) AS total_pacientes
FROM health_units
LEFT JOIN patients ON patients.health_unit_id = health_units.id
GROUP BY health_units.id, health_units.name;

-- Query para listar com nome informado
SELECT *
FROM patients
WHERE name LIKE '%Maria%';

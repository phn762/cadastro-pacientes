# Cadastro de pacientes

Projeto que permite cadastrar, buscar, editar e excluir pacientes vinculados a uma unidade de saúde. Foi feito com Laravel, MySQL e HTML, CSS e JavaScript puro, usando fetch para comunicar a interface com a API.

## Instruções de instalação

Você precisa de PHP 8.2 ou superior com `pdo_mysql`, Composer e MySQL ou MariaDB. Pode usar o PHP e o banco do XAMPP.

Depois de baixar ou clonar o projeto, abra o terminal na pasta principal e execute:

```powershell
cd app
composer install
Copy-Item .env.example .env
php artisan key:generate
```

No Linux ou macOS, use `cp .env.example .env` no lugar do comando de cópia.

Com o banco ligado, crie `desafio_jr` pelo phpMyAdmin ou pelo cliente SQL. Abra `app/.env` e ajuste a conexão. No XAMPP padrão, fica assim:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=desafio_jr
DB_USERNAME=root
DB_PASSWORD=
```

Ainda dentro da pasta `app`, crie as tabelas, cadastre as unidades e inicie o servidor:

```powershell
php artisan migrate --seed
php artisan serve
```

Abra [http://127.0.0.1:8000](http://127.0.0.1:8000). Mantenha o banco ligado e o terminal aberto; `Ctrl+C` para o servidor. No XAMPP, Apache só é necessário para acessar o phpMyAdmin. Não precisa rodar npm ou compilar o frontend.

Se quiser dados para testar a busca e a paginação, execute dentro de `app`:

```powershell
php artisan db:seed --class=PacientesSeeder
```

Esse seeder é opcional e insere 15 pacientes fictícios entre as três UBS. Pode executar novamente sem duplicar os mesmos CPFs ou alterar pacientes existentes.

## Como funciona

A organização segue o MVC do Laravel: Models trabalham com o banco pelo Eloquent, Controllers cuidam das operações e Views são as páginas feitas com Blade. O JavaScript envia requisições com `fetch` e atualiza a tela com as respostas JSON. Cadastro e edição são validados pelos Form Requests; o route model binding encontra o paciente pelo ID ou retorna 404.

A Home dá acesso a **Pacientes** e **Unidades**. Na tela de pacientes, Buscar vazio lista sem filtro; com um nome, faz uma busca parcial. A lista mostra nome, CPF e unidade, com 10 pacientes por página. É possível cadastrar, editar pelo lápis e excluir pela lixeira, com confirmação. Os campos mostram erros de validação, têm máscaras de CPF e telefone e ficam bloqueados durante o envio.

Nome, CPF, nascimento e unidade são obrigatórios. O CPF deve ter 11 números e ser único, sem verificação dos dígitos verificadores. Nascimento não pode ser futuro e a unidade deve existir. Nome não aceita números; telefone é opcional e aceita 8, 10 ou 11 números. CPF e telefone são armazenados sem pontuação.

As migrations criam `patients` e `health_units`, com chave estrangeira e CPF único. O seeder insere UBS Centro, UBS Vila e UBS Jardim, em Piracicaba. Cada paciente pertence a uma unidade. Uma instalação nova começa sem pacientes, que podem ser cadastrados pela tela.

As rotas da API ficam em `app/routes/api.php`:

| Método | Rota | Operação |
|---|---|---|
| GET | `/api/patients` | Listar; filtros opcionais `search` e `page` |
| POST | `/api/patients` | Cadastrar |
| GET | `/api/patients/{id}` | Consultar um paciente |
| PUT | `/api/patients/{id}` | Editar, enviando os campos obrigatórios completos |
| DELETE | `/api/patients/{id}` | Excluir |
| GET | `/api/health-units` | Listar unidades |

O arquivo [sql/consultas.sql](sql/consultas.sql) contém as consultas com `JOIN`, contagem por unidade incluindo as vazias com `LEFT JOIN` e `GROUP BY`, e busca com `LIKE`. Para executar, selecione `desafio_jr` no phpMyAdmin e cole as consultas na aba SQL. Na busca, troque Maria pelo termo desejado.

O fluxo solicitado está implementado, com paginação e máscaras como extras previstos no desafio. Também há uma Home e uma tela para consultar as unidades de saúde. As unidades são criadas pelo seeder e não possuem cadastro, edição ou exclusão pela interface.

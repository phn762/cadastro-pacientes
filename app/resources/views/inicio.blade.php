<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Início</title>
        <link rel="stylesheet" href="{{ asset('css/pacientes.css') }}">
    </head>
    <body>
        <main class="conteudo">
            <header class="cabecalho">
                <h1>Início</h1>
                <p>Selecione o que deseja consultar.</p>
            </header>
            <nav class="opcoes-inicio" aria-label="Áreas do sistema">
                <a class="painel opcao-inicio" href="/pacientes">
                    <h2>Pacientes</h2>
                    <p>Consultar pacientes e suas unidades de saúde.</p>
                </a>
                <a class="painel opcao-inicio" href="/unidades">
                    <h2>Unidades</h2>
                    <p>Consultar as unidades de saúde disponíveis.</p>
                </a>
            </nav>
        </main>
    </body>
</html>

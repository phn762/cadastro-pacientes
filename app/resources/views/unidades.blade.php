<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Unidades de saúde</title>
        <link rel="stylesheet" href="{{ asset('css/pacientes.css') }}">
        <script type="module" src="{{ asset('js/unidades.js') }}"></script>
    </head>
    <body>
        <main class="conteudo">
            <nav class="navegacao" aria-label="Navegação principal">
                <a class="botao-link botao-secundario" href="/">Início</a>
                <a class="botao-link botao-secundario" href="/pacientes">Pacientes</a>
            </nav>
            <header class="cabecalho">
                <h1>Unidades de saúde</h1>
                <p>Consulte as unidades disponíveis para vincular aos pacientes.</p>
            </header>
            <section class="painel" aria-labelledby="titulo-unidades">
                <h2 id="titulo-unidades">Lista de unidades</h2>
                <div id="resultado-unidades" aria-busy="false">
                    <p id="mensagem-unidades" class="mensagem" role="status">Carregando unidades…</p>
                    <div id="tabela-unidades" class="area-tabela" hidden>
                        <table>
                            <caption class="visualmente-oculto">Unidades de saúde disponíveis</caption>
                            <thead><tr><th scope="col">Nome</th><th scope="col">Cidade</th></tr></thead>
                            <tbody id="lista-unidades"></tbody>
                        </table>
                    </div>
                </div>
            </section>
            <noscript><p class="mensagem erro">Ative o JavaScript para consultar as unidades.</p></noscript>
        </main>
    </body>
</html>

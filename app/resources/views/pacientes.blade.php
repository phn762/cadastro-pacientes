<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Pacientes</title>
        <link rel="stylesheet" href="{{ asset('css/pacientes.css') }}">
        <script type="module" src="{{ asset('js/pacientes.js') }}"></script>
    </head>
    <body>
        <main class="conteudo">
            <nav class="navegacao" aria-label="Navegação principal">
                <a href="/">Início</a>
                <a href="/pacientes" aria-current="page">Pacientes</a>
                <a href="/unidades">Unidades</a>
            </nav>
            <header class="cabecalho">
                <h1>Pacientes</h1>
                <p>Clique em Buscar para listar os pacientes ou informe um nome para filtrar.</p>
            </header>

            <section class="painel" aria-labelledby="titulo-listagem">
                <h2 id="titulo-listagem">Lista de pacientes</h2>

                <form id="formulario-busca" class="formulario-busca" role="search">
                    <div class="campo">
                        <label for="busca">Nome do paciente</label>
                        <input id="busca" name="search" type="search" maxlength="255"
                            autocomplete="off">
                    </div>
                    <button type="submit" id="botao-buscar">Buscar</button>
                    <button type="button" id="botao-limpar" class="botao-secundario">Limpar busca</button>
                </form>

                <div id="resultado" aria-busy="false">
                    <p id="mensagem" class="mensagem" role="status" hidden></p>
                    <p id="total-pacientes" class="total" hidden></p>

                    <div id="area-tabela" class="area-tabela" hidden>
                        <table>
                            <caption class="visualmente-oculto">Pacientes encontrados</caption>
                            <thead>
                                <tr>
                                    <th scope="col">Nome</th>
                                    <th scope="col">CPF</th>
                                    <th scope="col">Unidade de saúde</th>
                                </tr>
                            </thead>
                            <tbody id="lista-pacientes"></tbody>
                        </table>
                    </div>

                    <nav id="paginacao" class="paginacao" aria-label="Páginas da lista de pacientes" hidden>
                        <button type="button" id="pagina-anterior" class="botao-secundario" disabled>Anterior</button>
                        <span id="informacao-pagina"></span>
                        <button type="button" id="proxima-pagina" class="botao-secundario" disabled>Próxima</button>
                    </nav>
                </div>
            </section>

            <noscript><p class="mensagem erro">Ative o JavaScript para consultar os pacientes.</p></noscript>
        </main>
    </body>
</html>

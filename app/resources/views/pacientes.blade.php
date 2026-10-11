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
                <a class="botao-link botao-secundario" href="/">Início</a>
                <a class="botao-link botao-secundario" href="/unidades">Unidades</a>
                <button type="button" id="novo-paciente" aria-controls="painel-cadastro" aria-expanded="false">Cadastrar paciente</button>
            </nav>
            <header class="cabecalho">
                <h1>Pacientes</h1>
                <p id="orientacao-busca">Clique em Buscar para listar os pacientes ou informe um nome para filtrar.</p>
            </header>

            <p id="aviso-cadastro" class="mensagem" role="status" hidden></p>

            <section id="painel-cadastro" class="painel painel-cadastro" aria-labelledby="titulo-cadastro" hidden>
                <h2 id="titulo-cadastro">Cadastrar paciente</h2>
                <p id="mensagem-cadastro" class="mensagem" role="status" hidden></p>
                <form id="formulario-cadastro" novalidate>
                    <fieldset id="campos-cadastro" class="campos-cadastro">
                        <legend class="visualmente-oculto">Dados do paciente</legend>
                        <div class="campo campo-completo">
                            <label for="nome-paciente">Nome</label>
                            <input id="nome-paciente" name="name" type="text" maxlength="255" autocomplete="name" required aria-describedby="erro-nome">
                            <p id="erro-nome" class="erro-campo" data-erro="name" hidden></p>
                        </div>
                        <div class="campo">
                            <label for="cpf-paciente">CPF</label>
                            <input id="cpf-paciente" name="cpf" type="text" inputmode="numeric" maxlength="14" required aria-describedby="erro-cpf">
                            <p id="erro-cpf" class="erro-campo" data-erro="cpf" hidden></p>
                        </div>
                        <div class="campo">
                            <label for="nascimento-paciente">Data de nascimento</label>
                            <input id="nascimento-paciente" name="birth_date" type="date" max="{{ now()->toDateString() }}" required aria-describedby="erro-nascimento">
                            <p id="erro-nascimento" class="erro-campo" data-erro="birth_date" hidden></p>
                        </div>
                        <div class="campo">
                            <label for="telefone-paciente">Telefone (opcional)</label>
                            <input id="telefone-paciente" name="phone" type="tel" maxlength="20" autocomplete="tel" aria-describedby="erro-telefone">
                            <p id="erro-telefone" class="erro-campo" data-erro="phone" hidden></p>
                        </div>
                        <div class="campo">
                            <label for="unidade-paciente">Unidade de saúde</label>
                            <select id="unidade-paciente" name="health_unit_id" required aria-describedby="erro-unidade">
                                <option value="">Selecione uma unidade</option>
                            </select>
                            <p id="erro-unidade" class="erro-campo" data-erro="health_unit_id" hidden></p>
                        </div>
                    </fieldset>
                    <div class="acoes-formulario">
                        <button type="submit" id="salvar-paciente">Salvar paciente</button>
                        <button type="button" id="cancelar-cadastro" class="botao-secundario">Cancelar</button>
                    </div>
                </form>
            </section>

            <section id="painel-listagem" class="painel" aria-labelledby="titulo-listagem">
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
                                    <th scope="col" class="coluna-acoes">Ações</th>
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

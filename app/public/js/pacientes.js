import { requisitarApi } from './api.js';

const formularioBusca = document.querySelector('#formulario-busca');
const campoBusca = document.querySelector('#busca');
const botaoBuscar = document.querySelector('#botao-buscar');
const botaoLimpar = document.querySelector('#botao-limpar');
const resultado = document.querySelector('#resultado');
const mensagem = document.querySelector('#mensagem');
const totalPacientes = document.querySelector('#total-pacientes');
const areaTabela = document.querySelector('#area-tabela');
const listaPacientes = document.querySelector('#lista-pacientes');
const paginacao = document.querySelector('#paginacao');
const informacaoPagina = document.querySelector('#informacao-pagina');
const botaoAnterior = document.querySelector('#pagina-anterior');
const botaoProxima = document.querySelector('#proxima-pagina');

let paginaAtual = 1;
let ultimaPagina = 1;
let buscaAtual = '';
let carregando = false;
let listagemDisponivel = false;

function atualizarBotoes() {
    campoBusca.disabled = carregando;
    botaoBuscar.disabled = carregando;
    botaoLimpar.disabled = carregando;
    botaoAnterior.disabled = carregando || !listagemDisponivel || paginaAtual <= 1;
    botaoProxima.disabled = carregando || !listagemDisponivel || paginaAtual >= ultimaPagina;
    resultado.setAttribute('aria-busy', String(carregando));
}

function exibirPacientes(pacientes) {
    listaPacientes.replaceChildren();

    for (const paciente of pacientes) {
        const linha = document.createElement('tr');
        const cpfFormatado = paciente.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

        for (const valor of [paciente.name, cpfFormatado, paciente.unidade_saude.name]) {
            const celula = document.createElement('td');
            celula.textContent = valor;
            linha.append(celula);
        }

        listaPacientes.append(linha);
    }
}

async function carregarPacientes(pagina = 1) {
    if (carregando) return;

    carregando = true;
    listagemDisponivel = false;
    atualizarBotoes();
    mensagem.hidden = false;
    mensagem.classList.remove('erro');
    mensagem.textContent = 'Carregando pacientes…';
    areaTabela.hidden = true;
    totalPacientes.hidden = true;
    paginacao.hidden = true;

    const parametros = new URLSearchParams({ page: pagina });
    if (buscaAtual) parametros.set('search', buscaAtual);

    try {
        const dados = await requisitarApi(`/patients?${parametros}`);
        paginaAtual = dados.current_page;
        ultimaPagina = dados.last_page;
        exibirPacientes(dados.data);
        listagemDisponivel = true;

        if (dados.data.length === 0) {
            mensagem.textContent = buscaAtual
                ? 'Nenhum paciente encontrado para essa busca.'
                : 'Nenhum paciente cadastrado ainda.';
            return;
        }

        mensagem.hidden = true;
        areaTabela.hidden = false;
        totalPacientes.hidden = false;
        totalPacientes.textContent = `${dados.total} ${dados.total === 1 ? 'paciente encontrado' : 'pacientes encontrados'}`;
        paginacao.hidden = false;
        informacaoPagina.textContent = `Página ${paginaAtual} de ${ultimaPagina}`;
    } catch {
        mensagem.classList.add('erro');
        mensagem.textContent = 'Não foi possível carregar os pacientes. Tente novamente usando o botão Buscar.';
    } finally {
        carregando = false;
        atualizarBotoes();
    }
}

formularioBusca.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (carregando) return;
    buscaAtual = campoBusca.value.trim();
    carregarPacientes();
});

botaoLimpar.addEventListener('click', () => {
    if (carregando) return;
    campoBusca.value = '';
    buscaAtual = '';
    paginaAtual = 1;
    ultimaPagina = 1;
    listagemDisponivel = false;
    listaPacientes.replaceChildren();
    areaTabela.hidden = true;
    totalPacientes.hidden = true;
    paginacao.hidden = true;
    mensagem.hidden = true;
    atualizarBotoes();
});

botaoAnterior.addEventListener('click', () => carregarPacientes(paginaAtual - 1));
botaoProxima.addEventListener('click', () => carregarPacientes(paginaAtual + 1));

atualizarBotoes();

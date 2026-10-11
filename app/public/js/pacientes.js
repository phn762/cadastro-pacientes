import { requisitarApi } from './api.js';
import { editarPaciente } from './cadastro.js';

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
const botaoNovo = document.querySelector('#novo-paciente');
const aviso = document.querySelector('#aviso-cadastro');
const confirmacaoExclusao = document.querySelector('#confirmacao-exclusao');
const nomeExclusao = document.querySelector('#nome-exclusao');

let paginaAtual = 1;
let ultimaPagina = 1;
let buscaAtual = '';
let carregando = false;
let listagemDisponivel = false;
let alterando = false;
let resolverConfirmacao = null;

function atualizarBotoes() {
    const ocupado = carregando || alterando;
    campoBusca.disabled = ocupado;
    botaoBuscar.disabled = ocupado;
    botaoLimpar.disabled = ocupado;
    botaoNovo.disabled = ocupado;
    botaoAnterior.disabled = ocupado || !listagemDisponivel || paginaAtual <= 1;
    botaoProxima.disabled = ocupado || !listagemDisponivel || paginaAtual >= ultimaPagina;
    for (const botao of listaPacientes.querySelectorAll('button')) botao.disabled = ocupado;
    resultado.setAttribute('aria-busy', String(ocupado));
}

function criarBotaoAcao(rotulo, desenho, aoClicar) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'botao-secundario botao-acao';
    botao.title = rotulo;
    botao.setAttribute('aria-label', rotulo);
    botao.addEventListener('click', aoClicar);

    const icone = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icone.setAttribute('viewBox', '0 0 24 24');
    icone.setAttribute('aria-hidden', 'true');
    const caminho = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    caminho.setAttribute('d', desenho);
    icone.append(caminho);
    botao.append(icone);
    return botao;
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

        const celulaAcoes = document.createElement('td');
        const acoes = document.createElement('div');
        acoes.className = 'acoes-paciente';
        acoes.append(
            criarBotaoAcao('Editar paciente', 'M16 3l5 5M4 15L16 3l5 5L9 20l-6 1 1-6z', () => abrirEdicao(paciente.id)),
            criarBotaoAcao('Excluir paciente', 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7', () => excluirPaciente(paciente))
        );
        celulaAcoes.append(acoes);
        linha.append(celulaAcoes);
        listaPacientes.append(linha);
    }
}

async function carregarPacientes(pagina = 1) {
    if (carregando || alterando) return;

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
        if (dados.current_page > dados.last_page) {
            carregando = false;
            await carregarPacientes(dados.last_page);
            return;
        }
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
    if (carregando || alterando) return;
    buscaAtual = campoBusca.value.trim();
    carregarPacientes();
});

botaoLimpar.addEventListener('click', () => {
    if (carregando || alterando) return;
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

document.addEventListener('paciente-salvo', () => {
    if (listagemDisponivel) carregarPacientes();
});

async function abrirEdicao(id) {
    if (carregando || alterando) return;
    alterando = true;
    atualizarBotoes();
    try {
        await editarPaciente(id);
    } finally {
        alterando = false;
        atualizarBotoes();
    }
}

function confirmarExclusao(paciente) {
    nomeExclusao.textContent = paciente.name;
    confirmacaoExclusao.returnValue = 'cancelar';
    confirmacaoExclusao.showModal();
    return new Promise((resolver) => {
        resolverConfirmacao = resolver;
    });
}

function encerrarConfirmacao(confirmado) {
    confirmacaoExclusao.close();
    resolverConfirmacao?.(confirmado);
    resolverConfirmacao = null;
}

confirmacaoExclusao.querySelector('form').addEventListener('submit', (evento) => {
    evento.preventDefault();
    encerrarConfirmacao(evento.submitter.value === 'excluir');
});

confirmacaoExclusao.addEventListener('cancel', (evento) => {
    evento.preventDefault();
    encerrarConfirmacao(false);
});

async function excluirPaciente(paciente) {
    if (carregando || alterando) return;

    const focoAnterior = document.activeElement;
    alterando = true;
    atualizarBotoes();

    try {
        if (!await confirmarExclusao(paciente)) return;
        aviso.hidden = true;
        await requisitarApi(`/patients/${paciente.id}`, 'DELETE');
        aviso.textContent = 'Paciente excluído com sucesso.';
        aviso.classList.remove('erro');
        aviso.classList.add('sucesso');
        aviso.hidden = false;
        alterando = false;
        await carregarPacientes(paginaAtual);
    } catch (erro) {
        aviso.textContent = erro.status === 404
            ? 'Este paciente já não existe. Atualize a busca.'
            : 'Não foi possível excluir o paciente. Tente novamente.';
        aviso.classList.remove('sucesso');
        aviso.classList.add('erro');
        aviso.hidden = false;
    } finally {
        alterando = false;
        atualizarBotoes();
        if (focoAnterior.isConnected) focoAnterior.focus();
        else botaoBuscar.focus();
    }
}

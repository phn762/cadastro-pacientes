import { requisitarApi } from './api.js';

const botaoNovo = document.querySelector('#novo-paciente');
const painel = document.querySelector('#painel-cadastro');
const painelListagem = document.querySelector('#painel-listagem');
const orientacaoBusca = document.querySelector('#orientacao-busca');
const formulario = document.querySelector('#formulario-cadastro');
const campos = document.querySelector('#campos-cadastro');
const botaoSalvar = document.querySelector('#salvar-paciente');
const botaoCancelar = document.querySelector('#cancelar-cadastro');
const mensagem = document.querySelector('#mensagem-cadastro');
const aviso = document.querySelector('#aviso-cadastro');
const campoCpf = formulario.elements.namedItem('cpf');
const campoTelefone = formulario.elements.namedItem('phone');
const campoUnidade = formulario.elements.namedItem('health_unit_id');

let salvando = false;
let carregandoUnidades = false;

function atualizarControles() {
    campos.disabled = salvando || carregandoUnidades;
    botaoSalvar.disabled = salvando || carregandoUnidades || campoUnidade.options.length <= 1;
    botaoCancelar.disabled = salvando;
    botaoNovo.disabled = salvando || carregandoUnidades;
    botaoSalvar.textContent = salvando ? 'Salvando…' : 'Salvar paciente';
    formulario.setAttribute('aria-busy', String(salvando || carregandoUnidades));
}

function limparErros() {
    for (const erro of formulario.querySelectorAll('[data-erro]')) {
        erro.hidden = true;
        erro.textContent = '';
        formulario.elements.namedItem(erro.dataset.erro).removeAttribute('aria-invalid');
    }
    mensagem.hidden = true;
    mensagem.classList.remove('erro');
}

function fecharCadastro() {
    painel.hidden = true;
    painelListagem.hidden = false;
    orientacaoBusca.hidden = false;
    botaoNovo.setAttribute('aria-expanded', 'false');
    botaoNovo.focus();
}

async function abrirCadastro() {
    if (salvando || carregandoUnidades) return;
    if (!painel.hidden) {
        formulario.elements.namedItem('name').focus();
        return;
    }

    formulario.reset();
    limparErros();
    aviso.hidden = true;
    painel.hidden = false;
    painelListagem.hidden = true;
    orientacaoBusca.hidden = true;
    botaoNovo.setAttribute('aria-expanded', 'true');
    carregandoUnidades = true;
    atualizarControles();
    mensagem.hidden = false;
    mensagem.textContent = 'Carregando unidades…';
    campoUnidade.replaceChildren(new Option('Selecione uma unidade', ''));

    try {
        const unidades = await requisitarApi('/health-units');
        for (const unidade of unidades) {
            campoUnidade.add(new Option(unidade.name, unidade.id));
        }
        mensagem.hidden = unidades.length > 0;
        mensagem.textContent = 'Não há unidades disponíveis para cadastrar pacientes.';
    } catch {
        mensagem.classList.add('erro');
        mensagem.textContent = 'Não foi possível carregar as unidades. Cancele e abra o cadastro novamente para tentar.';
    } finally {
        carregandoUnidades = false;
        atualizarControles();
        if (!painel.hidden) formulario.elements.namedItem('name').focus();
    }
}

campoCpf.addEventListener('input', () => {
    campoCpf.value = campoCpf.value.replace(/\D/g, '').slice(0, 11)
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
});

campoTelefone.addEventListener('input', () => {
    const numeros = campoTelefone.value.replace(/\D/g, '').slice(0, 20);
    if (numeros.length > 11) {
        campoTelefone.value = numeros;
        return;
    }
    const tamanhoPrefixo = numeros.length > 10 ? 5 : 4;
    const ddd = numeros.slice(0, 2);
    const prefixo = numeros.slice(2, 2 + tamanhoPrefixo);
    const final = numeros.slice(2 + tamanhoPrefixo);
    campoTelefone.value = numeros.length > 2
        ? `(${ddd}) ${prefixo}${final ? '-'+final : ''}`
        : numeros;
});

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (salvando || carregandoUnidades || botaoSalvar.disabled) return;
    limparErros();

    const dados = {
        name: formulario.elements.namedItem('name').value.trim(),
        cpf: campoCpf.value.replace(/\D/g, ''),
        birth_date: formulario.elements.namedItem('birth_date').value,
        phone: campoTelefone.value.replace(/\D/g, '') || null,
        health_unit_id: campoUnidade.value ? Number(campoUnidade.value) : '',
    };

    salvando = true;
    atualizarControles();

    try {
        await requisitarApi('/patients', 'POST', dados);
        formulario.reset();
        fecharCadastro();
        aviso.textContent = 'Paciente cadastrado com sucesso. Use Buscar para consultar a lista.';
        aviso.classList.add('sucesso');
        aviso.hidden = false;
        document.dispatchEvent(new CustomEvent('paciente-cadastrado'));
    } catch (erro) {
        mensagem.hidden = false;
        mensagem.classList.add('erro');
        mensagem.textContent = 'Não foi possível cadastrar o paciente. Tente novamente.';

        if (erro.status === 422 && erro.dados?.errors) {
            mensagem.textContent = 'Revise os campos indicados abaixo.';
            let primeiroCampo = null;
            for (const [nome, mensagens] of Object.entries(erro.dados.errors)) {
                const elementoErro = formulario.querySelector(`[data-erro="${nome}"]`);
                const campo = formulario.elements.namedItem(nome);
                if (!elementoErro || !campo) continue;
                elementoErro.textContent = mensagens[0];
                elementoErro.hidden = false;
                campo.setAttribute('aria-invalid', 'true');
                primeiroCampo ??= campo;
            }
            salvando = false;
            atualizarControles();
            primeiroCampo?.focus();
        }
    } finally {
        salvando = false;
        atualizarControles();
        if (painel.hidden) botaoNovo.focus();
    }
});

botaoNovo.addEventListener('click', abrirCadastro);
botaoCancelar.addEventListener('click', fecharCadastro);

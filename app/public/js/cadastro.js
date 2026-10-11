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
const tituloFormulario = document.querySelector('#titulo-cadastro');

let salvando = false;
let carregandoUnidades = false;
let pacienteEmEdicao = null;
let formularioDisponivel = false;

function atualizarControles() {
    campos.disabled = salvando || carregandoUnidades;
    botaoSalvar.disabled = salvando || carregandoUnidades || !formularioDisponivel;
    botaoCancelar.disabled = salvando;
    botaoNovo.disabled = salvando || carregandoUnidades;
    botaoSalvar.textContent = salvando ? 'Salvando…' : pacienteEmEdicao ? 'Salvar alterações' : 'Salvar paciente';
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

async function abrirCadastro(id = null) {
    if (salvando || carregandoUnidades) return;
    if (!painel.hidden && pacienteEmEdicao === id) {
        formulario.elements.namedItem('name').focus();
        return;
    }

    formulario.reset();
    pacienteEmEdicao = id;
    formularioDisponivel = false;
    tituloFormulario.textContent = id ? 'Editar paciente' : 'Cadastrar paciente';
    limparErros();
    aviso.hidden = true;
    painel.hidden = false;
    painelListagem.hidden = true;
    orientacaoBusca.hidden = true;
    botaoNovo.setAttribute('aria-expanded', 'true');
    carregandoUnidades = true;
    atualizarControles();
    mensagem.hidden = false;
    mensagem.textContent = id ? 'Carregando paciente e unidades…' : 'Carregando unidades…';
    campoUnidade.replaceChildren(new Option('Selecione uma unidade', ''));

    try {
        const [unidades, paciente] = await Promise.all([
            requisitarApi('/health-units'),
            id ? requisitarApi(`/patients/${id}`) : Promise.resolve(null),
        ]);
        for (const unidade of unidades) {
            campoUnidade.add(new Option(unidade.name, unidade.id));
        }
        mensagem.hidden = unidades.length > 0;
        mensagem.textContent = 'Não há unidades disponíveis para cadastrar pacientes.';
        formularioDisponivel = unidades.length > 0;
        if (paciente) {
            for (const nome of ['name', 'cpf', 'birth_date', 'phone', 'health_unit_id']) {
                formulario.elements.namedItem(nome).value = paciente[nome] ?? '';
            }
            campoCpf.dispatchEvent(new Event('input'));
            if (campoTelefone.value.length <= 11) campoTelefone.dispatchEvent(new Event('input'));
        }
    } catch (erro) {
        mensagem.classList.add('erro');
        mensagem.textContent = erro.status === 404
            ? 'Este paciente não foi encontrado. Cancele e atualize a busca.'
            : 'Não foi possível carregar os dados. Cancele e tente novamente.';
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
    const numeros = campoTelefone.value.replace(/\D/g, '').slice(0, 11);
    if (numeros.length <= 8) {
        campoTelefone.value = numeros.replace(/^(\d{4})(\d)/, '$1-$2');
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
        const editando = pacienteEmEdicao !== null;
        await requisitarApi(editando ? `/patients/${pacienteEmEdicao}` : '/patients', editando ? 'PUT' : 'POST', dados);
        formulario.reset();
        fecharCadastro();
        aviso.textContent = editando
            ? 'Paciente atualizado com sucesso.'
            : 'Paciente cadastrado com sucesso. Use Buscar para consultar a lista.';
        aviso.classList.remove('erro');
        aviso.classList.add('sucesso');
        aviso.hidden = false;
        document.dispatchEvent(new CustomEvent('paciente-salvo'));
    } catch (erro) {
        mensagem.hidden = false;
        mensagem.classList.add('erro');
        mensagem.textContent = erro.status === 404
            ? 'Este paciente não foi encontrado. Cancele e atualize a busca.'
            : 'Não foi possível salvar o paciente. Tente novamente.';

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

export async function editarPaciente(id) {
    await abrirCadastro(id);
}

botaoNovo.addEventListener('click', () => abrirCadastro());
botaoCancelar.addEventListener('click', fecharCadastro);

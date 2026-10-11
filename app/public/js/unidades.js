import { requisitarApi } from './api.js';

const botaoAtualizar = document.querySelector('#atualizar-unidades');
const resultado = document.querySelector('#resultado-unidades');
const mensagem = document.querySelector('#mensagem-unidades');
const tabela = document.querySelector('#tabela-unidades');
const lista = document.querySelector('#lista-unidades');

async function carregarUnidades() {
    if (botaoAtualizar.disabled) return;

    botaoAtualizar.disabled = true;
    resultado.setAttribute('aria-busy', 'true');
    mensagem.hidden = false;
    mensagem.classList.remove('erro');
    mensagem.textContent = 'Carregando unidades…';
    tabela.hidden = true;
    lista.replaceChildren();

    try {
        const unidades = await requisitarApi('/health-units');

        for (const unidade of unidades) {
            const linha = document.createElement('tr');
            for (const valor of [unidade.name, unidade.city]) {
                const celula = document.createElement('td');
                celula.textContent = valor;
                linha.append(celula);
            }
            lista.append(linha);
        }

        mensagem.hidden = unidades.length > 0;
        mensagem.textContent = 'Nenhuma unidade disponível.';
        tabela.hidden = unidades.length === 0;
    } catch {
        mensagem.classList.add('erro');
        mensagem.textContent = 'Não foi possível carregar as unidades. Tente novamente usando Atualizar lista.';
    } finally {
        botaoAtualizar.disabled = false;
        resultado.setAttribute('aria-busy', 'false');
    }
}

botaoAtualizar.addEventListener('click', carregarUnidades);
carregarUnidades();

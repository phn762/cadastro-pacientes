export async function requisitarApi(caminho, metodo = 'GET', dados = null) {
    const opcoes = {
        method: metodo,
        headers: { Accept: 'application/json' },
    };

    if (dados !== null) {
        opcoes.headers['Content-Type'] = 'application/json';
        opcoes.body = JSON.stringify(dados);
    }

    const resposta = await fetch(`/api${caminho}`, opcoes);

    if (resposta.status === 204) {
        return null;
    }

    const texto = await resposta.text();
    let conteudo = null;

    try {
        conteudo = texto ? JSON.parse(texto) : null;
    } catch {
        if (resposta.ok) {
            throw new Error('O servidor retornou uma resposta inválida.');
        }
    }

    if (!resposta.ok) {
        const erro = new Error('Não foi possível realizar a operação.');
        erro.status = resposta.status;
        erro.dados = conteudo;
        throw erro;
    }

    return conteudo;
}

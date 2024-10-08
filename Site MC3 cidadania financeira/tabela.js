// Função para carregar o CSV e retornar o valor de uma célula
async function carregarCSV() {
    const response = await fetch('CSV/IPCA.csv');
    const data = await response.text();
    const linhas = data.split('\n'); // Divide o conteúdo em linhas
    return linhas.map(linha => linha.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)); // Usa regex para separar corretamente as colunas
}

// Função para pegar o valor de uma célula específica
async function obterValorCelula(linha, coluna) {
    const linhas = await carregarCSV(); // Carrega as linhas do CSV
    const linhaEscolhida = linhas[linha - 1]; // Acessa a linha desejada (compensação de índice)
    
    // Verifica se a linha foi corretamente carregada e existe a coluna
    if (linhaEscolhida && linhaEscolhida[coluna - 1]) {
        const valor = linhaEscolhida[coluna - 1].replace(/"/g, ''); // Remove aspas duplas se houver
        return valor;
    }
    return null;
}

// Função para tratar o envio do formulário
document.getElementById('meuFormulario').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita o recarregamento da página ao submeter o formulário
    
    // Obtém o valor de mês e ano selecionados
    const mesAno = document.getElementById('mes-ano').value;
    const [ano, mesNumero] = mesAno.split('-');
    const mes = parseInt(mesNumero);

    const anoA = ano-1994
    const anoB = anoA*12



    // Pega os valores de linha e coluna inseridos no formulário
    const linha = anoB+mes;
    const coluna = 2;

    // Obtém o valor da célula correspondente
    const valor = await obterValorCelula(linha, coluna);

    // Se o valor for encontrado, converte para número (se houver vírgula, substitui por ponto) e exibe
    if (valor) {
        const valorNumerico = parseFloat(valor.replace(',', '.')); // Substitui a vírgula por ponto
        document.getElementById('resultado').innerText = `O valor da célula (linha ${linha}, coluna ${coluna}) é: ${valorNumerico}`;
    } else {
        document.getElementById('resultado').innerText = 'Célula não encontrada ou valor inválido.';
    }
});
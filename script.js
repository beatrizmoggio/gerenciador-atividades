// Carrega as atividades salvas no LocalStorage (API do navegador), ou cria arrays (listas) vazios se não houver dados
let atividades = JSON.parse(localStorage.getItem('atividades')) || []; 
let atividadesFinalizadas = JSON.parse(localStorage.getItem('atividadesFinalizadas')) || []; 


function adicionarAtividade() {
    // 1. Cria as variáveis para armazenar os valores preenchidos nos campos de entrada
    const titulo = document.getElementById("titulo").value;
    const disciplina = document.getElementById("disciplina").value;
    const data = document.getElementById("data").value;

    // 2. Verifica se todos os campos foram preenchidos
    if (titulo === "" || data === "") {
        alert("Preencha todos os campos!");  // Exibe um alerta se os campos não forem preenchidos
        return;
    }

    // 3. Adiciona a nova atividade no final do array 'atividades', com status de "não concluída"
    atividades.push({ titulo, disciplina, data, concluida: false });

    // 4. Ordena as atividades pela data (do menor para o maior)
    atividades.sort((a, b) => a.data.localeCompare(b.data));

    // 5. Salva as atividades no LocalStorage para persistência
    localStorage.setItem('atividades', JSON.stringify(atividades));

    // 6. Limpa os campos de entrada após a adição
    document.getElementById("titulo").value = "";
    document.getElementById("data").value = "";

    // 7. Atualiza a visualização das atividades na tela
    exibirAtividades();
}


function exibirAtividades(filtradas = null) {
    // 1. Cria uma variável para referenciar a lista de atividades na página
    const lista = document.getElementById("listaAtividades");
    lista.innerHTML = "";  // 2. Limpa a lista de atividades exibidas na tela

    // 3. Se 'filtradas' for nulo, usa 'atividades' como o array a ser exibido, caso contrário, usa 'filtradas'
    const arrayAtividadeFiltro = filtradas || atividades;

    // 4. Percorre todas as atividades e exibe no HTML
    for (let index = 0; index < arrayAtividadeFiltro.length; index++) {
        const atv = arrayAtividadeFiltro[index];
        const div = document.createElement("div");

        // 5. Define a classe CSS da div com base na disciplina e no status de conclusão
        let className = 'atividade ' + getDisciplinaClass(atv.disciplina);
        if (atv.concluida) {
            className += ' finalizada';  // Adiciona a classe "finalizada" se a atividade estiver concluída
        }
        div.className = className;

        // 6. Adiciona os dados da atividade (titulo, disciplina, data) na div
        div.innerHTML = `
            <strong>Título: ${atv.titulo}</strong><br>
            <strong>Disciplina: </strong> ${atv.disciplina}<br>
            <strong>Data: </strong> ${atv.data} 
            <div class="buttons">
                <button onclick="concluirAtividade(${index})" class="btnConcluir">Concluir</button>
                <button onclick="editarAtividade(${index})" class="btnEditar">Editar</button>
                <button onclick="removerAtividade(${index})" class="btnRemover">Remover</button>
            </div>
        `;

        // 7. Adiciona a div de cada atividade na lista de atividades no HTML
        lista.appendChild(div);
    }
}


function concluirAtividade(index) {
    // 1. Remove a atividade da lista de atividades ativas
    const atividade = atividades.splice(index, 1)[0];  // Remove 1 item no índice 'index'
    atividade.concluida = true;  // Marca a atividade como concluída
    atividadesFinalizadas.push(atividade);  // Adiciona a atividade concluída à lista de atividades finalizadas

    // 2. Salva as atividades ativas restantes no LocalStorage
    localStorage.setItem('atividades', JSON.stringify(atividades));

    // 3. Salva as atividades finalizadas no LocalStorage
    localStorage.setItem('atividadesFinalizadas', JSON.stringify(atividadesFinalizadas));

    // 4. Atualiza a visualização das atividades
    exibirAtividades();
    exibirAtividadesFinalizadas();
}


function editarAtividade(index) {
    // 1. Pega a atividade que será editada
    const atividade = atividades[index];

    // 2. Remove a atividade da lista antes de editar
    atividades.splice(index, 1);

    // 3. Preenche os campos de entrada com os dados da atividade a ser editada
    document.getElementById("titulo").value = atividade.titulo;
    document.getElementById("disciplina").value = atividade.disciplina;
    document.getElementById("data").value = atividade.data;

    // 4. Atualiza o LocalStorage
    localStorage.setItem('atividades', JSON.stringify(atividades));

    // 5. Atualiza a visualização das atividades
    exibirAtividades();
}


function removerAtividade(index) {
    // 1. Confirma a remoção da atividade com o usuário
    if (confirm("Tem certeza que deseja remover esta atividade?")) {
        // 2. Remove a atividade no índice especificado
        atividades.splice(index, 1);

        // 3. Atualiza o LocalStorage
        localStorage.setItem('atividades', JSON.stringify(atividades));

        // 4. Atualiza a visualização das atividades
        exibirAtividades();  
    }
}


function exibirAtividadesFinalizadas() {
    // 1. Cria uma variável para referenciar a lista de atividades finalizadas no HTML
    const lista = document.getElementById("listaFinalizadas");
    lista.innerHTML = "";  // Limpa a lista de atividades finalizadas na tela

    // 2. Percorre todas as atividades finalizadas e exibe no HTML
    for (let i = 0; i < atividadesFinalizadas.length; i++) {
        const atv = atividadesFinalizadas[i];
        const div = document.createElement("div");

        // 3. Define a classe CSS da div com base na disciplina e no status de conclusão
        let className = 'atividade ' + getDisciplinaClass(atv.disciplina);
        if (atv.concluida) {
            className += ' finalizada';
        }
        div.className = className;

        // 4. Adiciona os dados da atividade finalizada na div
        div.innerHTML = `
            <strong>${atv.titulo}</strong><br>
            <strong>Disciplina: </strong>${atv.disciplina}<br>
            <strong>Data: </strong>${atv.data}
        `;

        // 5. Adiciona a div da atividade finalizada na lista de atividades finalizadas no HTML
        lista.appendChild(div);
    }
}


function getDisciplinaClass(disciplina) {
    // 1. Verifica qual disciplina corresponde e retorna a classe CSS correspondente
    // Usado para estilizar as atividades com base nas dicisplinas
    switch (disciplina) {
        case 'Algoritmos': return 'algoritmos';
        case 'Banco de Dados': return 'bancoDados';
        case 'Arquitetura e Organização de Computadores': return 'arquitetura';
        case 'Análise e Projeto de Software': return 'aps';
        case 'Cálculo Diferencial e Integral 1': return 'calculo';
        default: return '';  // Se não houver correspondência, retorna uma string vazia
    }
}


function filtrarAtividades() {
    // 1. Cria variáveis para armazenar os valores dos filtros
    const filtroTitulo = document.getElementById("filtroTitulo").value.toLowerCase();
    const filtroDisciplina = document.getElementById("filtroDisciplina").value;
    const filtroDataInicio = document.getElementById("filtroDataInicio").value;
    const filtroDataFim = document.getElementById("filtroDataFim").value;

    // 2. Cria um array vazio para armazenar as atividades filtradas
    const atividadesFiltradas = [];  

    // 3. Percorre todas as atividades para aplicar os filtros
    for (let i = 0; i < atividades.length; i++) {
        const atv = atividades[i];
        let incluirAtividade = true;

        // 4. Aplica os filtros de título, disciplina e data
        if (filtroTitulo && !atv.titulo.toLowerCase().includes(filtroTitulo)) {
            incluirAtividade = false;
        }
        if (filtroDisciplina && atv.disciplina !== filtroDisciplina) {
            incluirAtividade = false;
        }
        if (filtroDataInicio && new Date(atv.data) < new Date(filtroDataInicio)) {
            incluirAtividade = false;
        }
        if (filtroDataFim && new Date(atv.data) > new Date(filtroDataFim)) {
            incluirAtividade = false;
        }

        // 5. Se a atividade passar por todos os filtros, significa que ela está dentro do array
        // Então ela é adicionada ao array atividadesFiltradas
        if (incluirAtividade) {
            atividadesFiltradas.push(atv);
        }
    }

    // 6. Exibe as atividades filtradas
    exibirAtividades(atividadesFiltradas);
}


function limparFiltros() {
    // 1. Limpa os campos dos filtros
    document.getElementById("filtroTitulo").value = "";
    document.getElementById("filtroDisciplina").value = "";
    document.getElementById("filtroDataInicio").value = "";
    document.getElementById("filtroDataFim").value = "";

    // 2. Exibe todas as atividades novamente
    exibirAtividades();
}


function limparDados() {
    if (confirm("Tem certeza que deseja remover esta atividade?")) {
        // 1. Remove as atividades pendentes e as atividades finalizadas do LocalStorage
        localStorage.removeItem('atividades');
        localStorage.removeItem('atividadesFinalizadas');
        
        // 2. Limpa os arrays de atividades
        atividades = [];
        atividadesFinalizadas = [];

        // 3. Atualiza a visualização das atividades
        exibirAtividades();
        exibirAtividadesFinalizadas();
    }
}


// Exibe as atividades ao carregar a página
exibirAtividades();
exibirAtividadesFinalizadas();

// (Kaylane) - Adicionei as funções pro modal e removi o sistema de tradução (A tradução era instável e deixava a aplicação lenta)
// Receber os ingredientes do usuário
// Buscar as receitas na API
// Exibir as receitas na tela
// Exibir detalhes da receita em um modal

// Chave API
const API_KEY = "743c537ae764431c95dcfedb456c9054";

// Espera o documento HTML carregar completamente
document.addEventListener("DOMContentLoaded", () => {

    // Seleção dos elementos do DOM
    const ingredientInput = document.getElementById("ingredient-input");
    const searchBtn = document.getElementById("search-btn");
    const mainContainer = document.querySelector(".main-section.search-container");
    const loader = document.getElementById("loader");
    const resultsContainer = document.querySelector(".section-recipe");
    const resultsGrid = document.getElementById("recipes-grid");
    const modalOverlay = document.getElementById("modal-overlay");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalDetailsContent = document.getElementById("modal-details-content");

    // Evento de clique do botão "Buscar"
    searchBtn.addEventListener("click", handleSearch);

    // Evento de clique no card da receita
    resultsGrid.addEventListener("click", handleCardClick);

    // Evento de clique no botão de fechar modal
    modalCloseBtn.addEventListener("click", closeModal);

    //Evento de clique fora do modal para fechar
    modalOverlay.addEventListener("click", (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    // Função que gerencia o fluxo de busca e exibição
    async function handleSearch() {
        // Pega os ingredientes digitados
        const ingredientesInput = ingredientInput.value;

        // Verifica se o input está vazio
        if (ingredientesInput.trim() === "") {
            alert("Por favor, digite os ingredientes.");
            return;
        }

        // Prepara a interface para a busca
        loader.querySelector('p').textContent = 'Buscando...'; // Mensagem do loader
        loader.style.display = 'flex'; // Mostra o loader
        mainContainer.classList.add('hidden'); // Esconde a tela de busca
        resultsContainer.style.display = 'none'; // Esconde resultados antigos

        // A função  try é utilizada pra envolver um bloco de código que pode gerar erros        
        try {
    
            // 1. Busca as receitas na API
            const recipes = await fetchRecipes(ingredientesInput);

            // 2. Verifica se encontrou alguma receita
            if (recipes.length === 0) {
                // Se a API não retornar nada
                resultsGrid.innerHTML = '<p>Nenhuma receita encontrada com esses ingredientes.</p>';
                resultsContainer.style.display = 'block';
                return;
            }

            // 3. Mostra as receitas na tela
            renderRecipes(recipes);

            // 5. Mostra a seção de resultados
            resultsContainer.style.display = 'block';

        }

        // A função catch é utilizada pra achar erros inesperados que possam ocorrer durante a execução do bloco try
        // Ex: problemas de rede, erros na API, etc.
        catch (error) {
            // Mostra no console e avisa o usuário
            console.error("Erro ao buscar receitas:", error);
            resultsGrid.innerHTML = "<p>Erro ao buscar receitas. Tente novamente.</p>";
            resultsContainer.style.display = 'block'; // Mostra a msg de erro
        }

        // A função finally é executada após o try e catch, independentemente do resultado
        finally {
            // Independentemente de sucesso ou erro, esconde o loader
            loader.style.display = 'none';
        }
    }

    // Função que busca receitas na API 
    async function fetchRecipes(ingredients) {

        // A URL 'findByIngredients' foi usada pra buscar pelo que o usuário tem dentro das receitas disponíveis
        // 'number=10' chama 10 resultados pra limitar a quantidade de chamadas (por causa da API limitadda)
        const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredients}&number=10`;

        console.log("Buscando na URL:", url);

        // Faz a requisição para a API
        const response = await fetch(url);

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            // Se a API retornar um erro (ex: 401 Chave Inválida, 404, 500)
            throw new Error(`Erro de API: ${response.statusText} (Status: ${response.status})`);
        }

        // Converte a resposta em JSON
        const data = await response.json();
        return data; // Retorna o array de receitas
    }

    // Função que mostra as receitas na tela
    function renderRecipes(recipes) {
        // Limpa os resultados anteriores
        resultsGrid.innerHTML = '';

        // Verifica se encontrou alguma receita, se não, avisa o usuário
        if (recipes.length === 0) {
            resultsGrid.innerHTML = '<p>Nenhuma receita encontrada com esses ingredientes.</p>';
            return;
        }

        // Cria um card para cada receita
        recipes.forEach(recipe => {
            // Cria o elemento do card
            const card = document.createElement('div');
            // Adiciona a classe CSS
            card.className = 'recipe-card';

            // Adicionam o ID da receita no 'dataset' (Precisamos disso pra função de exibir detalhes)
            card.dataset.recipeId = recipe.id;

            // Preenche o card com a imagem e título da receita
            card.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
            `;

            // Adiciona o card ao grid de resultados
            resultsGrid.appendChild(card);
        });
    }

    // Função que fecha o modal
    async function handleCardClick(event) {
        // 'closest' encontra o '.recipe-card' mais próximo de onde o usuário clicou
        const card = event.target.closest('.recipe-card');

        // Se o clique não foi em um card (foi no espaço entre eles), não faz nada
        if (!card) return;

        // Pega o ID guardado no 'dataset' na função renderRecipes
        const recipeId = card.dataset.recipeId;

        // Mostra o modal com uma mensagem de "carregando"
        modalOverlay.style.display = 'flex';
        modalDetailsContent.innerHTML = '<p>Carregando detalhes...</p>';

        try {
            // Busca os detalhes específicos da receita
            const details = await fetchRecipeDetails(recipeId);

            // Mostra os detalhes completos dentro do modal
            renderRecipeDetails(details);

        } catch (error) {
            console.error("Erro ao buscar detalhes da receita:", error);
            modalDetailsContent.innerHTML = '<p>Não foi possível carregar os detalhes.</p>';
        }
    }

    // Função que exibe os detalhes da receita no modal
    async function fetchRecipeDetails(id) {
        const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`;

        console.log("Buscando detalhes na URL:", url);

        // Faz a requisição para a API
        const response = await fetch(url);
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro de API: ${response.statusText} (Status: ${response.status})`);
        }
        // Converte a resposta em JSON
        const data = await response.json();
        return data; // Retorna um objeto com todos os detalhes
    }

    // Função que preenche o modal com os detalhes da receita
    function renderRecipeDetails(recipe) {
        // Cria a lista de ingredientes (<li>)
        // "map" transforma cada item do array em uma string de HTML
        // "join" junta todas as strings em uma só
        const ingredientsHtml = recipe.extendedIngredients.map(ingredient => {
            return `<li>${ingredient.original}</li>`;
        }).join('');

        // Constrói o HTML final do modal
        // Mostra título, imagem, ingredientes e instruções e se não houver instruções, mostra uma mensagem padrão
        modalDetailsContent.innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}">
            
            <h3>Ingredientes</h3>
            <ul>
                ${ingredientsHtml}
            </ul>

            <h3>Instruções</h3>
            <div class="instructions">
                ${recipe.instructions || 'Instruções não disponíveis.'}
            </div>
        `;
    }

    // Função que fecha o modal
    function closeModal() {
        // Esconde o modal
        modalOverlay.style.display = 'none';
        // Limpa o conteúdo para não exibir o conteúdo antigo na próxima vez
        modalDetailsContent.innerHTML = '';
    }

});
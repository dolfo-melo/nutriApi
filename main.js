// (Kaylane) - Nesse Script tem as primeiras funções do projeto (Tentei comentar o máximo possível pra facilitar o entendimento):
// Receber os ingredientes do usuário
// Buscar as receitas na API
// Exibir as receitas na tela

// Chave API
const API_KEY = "743c537ae764431c95dcfedb456c9054";

// Espera o documento HTML carregar completamente
document.addEventListener("DOMContentLoaded", () => {

    // Seleção dos elementos do DOM
    const ingredientInput = document.getElementById("ingredient-input");
    const searchBtn = document.getElementById("search-btn");
    const mainContainer = document.querySelector("main.container");
    const loader = document.getElementById("loader");
    const resultsContainer = document.getElementById("results-container");
    const resultsGrid = document.getElementById("results-grid");

    // Evento de clique ao botão "Buscar"
    searchBtn.addEventListener("click", handleSearch);

    // Função que gerencia o fluxo de busca e exibição
    async function handleSearch() {
        // Pega os ingredientes digitados
        const ingredients = ingredientInput.value;

        // Verifica se o input está vazio
        if (ingredients.trim() === "") {
            alert("Por favor, digite os ingredientes.");
            return;
        }

        // Prepara a interface para a busca
        loader.style.display = 'flex'; // Mostra o loader
        mainContainer.classList.add('hidden'); // Esconde a tela de busca
        resultsContainer.style.display = 'none'; // Esconde resultados antigos

        // A função  try é utilizada pra envolver um bloco de código que pode gerar erros        
        try {
            // 1. Busca as receitas na API
            const recipes = await fetchRecipes(ingredients);
            
            // 2. Mostra as receitas na tela
            renderRecipes(recipes);
            
            // 3. Mostra a seção de resultados
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

});
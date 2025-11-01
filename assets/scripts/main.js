/* ===========================================
    1. CHAVES E CONSTANTES GLOBAIS (Adição)
=========================================== */

// Chave API
const API_KEY = "743c537ae764431c95dcfedb456c9054"

// URL Base para buscar receitas por ingredientes
const RECIPES_BASE_URL = "https://api.spoonacular.com/recipes/findByIngredients"

// URL Base para buscar detalhes de uma receita
const DETAILS_BASE_URL = "https://api.spoonacular.com/recipes"

// Espera o documento HTML carregar completamente
document.addEventListener("DOMContentLoaded", () => {

    /* ===================================
        2. SELEÇÃO DOS ELEMENTOS DO DOM
    =================================== */
    // URL Antiga-> https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&number=5

    // URL Nova -> https://api.spoonacular.com/recipes/716429/information?apiKey=${apiKey}&includeNutrition=true.
*/

const baseUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?i=ingrediente1,ingrediente2" // URL Base
const alimentosPesquisa = document.getElementById("pesquisar")

// Função de conectar API
async function conectarApi() {
    
    // Elementos da Busca e Container Principal
    const mainContainer = document.querySelector(".search-container")
    const ingredientInput = document.getElementById("ingredient-input") // Input de texto
    const searchBtn = document.getElementById("search-btn")            // Botão de busca
    const loader = document.getElementById("loader")
    
    // Elementos de Exibição de Resultados
    const resultsContainer = document.querySelector(".section-recipe");
    
    // Mapeando o div que contém os resultados
    const resultsGrid = document.querySelector(".general-recipes"); 
    
    // Elementos de Detalhes
    const recipeDetailsContainer = document.getElementById("recipe-details-container");
    const backBtn = document.getElementById("back-btn");

    /* ======================
        3 .EVENT LISTENERS
    ====================== */

    // Evento de clique do botão "Buscar"
    searchBtn.addEventListener("click", handleSearch); 

    // Evento de clique do botão "Sair" na tela de detalhes
    if (backBtn && recipeDetailsContainer) {
        backBtn.addEventListener("click", () => {
            // Volta para a tela de busca e esconde os detalhes
            recipeDetailsContainer.classList.add("hidden");
            mainContainer.classList.remove("hidden"); 
            // Mostra os resultados novamente
            resultsContainer.classList.remove("hidden");
        });
    }

    // Evento de clique em uma receita
    if (resultsGrid) {
        resultsGrid.addEventListener("click", (event) => {
            // Verifica se o clique foi em um card de receita
            const recipeCard = event.target.closest(".recipe-card");
            // Se for, pega o ID da receita e mostra os detalhes
            if (recipeCard) {
                const recipeId = recipeCard.dataset.recipeId;
                // Chama a função que mostra os detalhes da receita
                showRecipeDetails(recipeId);
            }
        });
    }
    
    /* ========================================================
        4 - FUNÇÕES ASSÍNCRONAS DE API (Conexão e Detalhes)
    ======================================================== */

    // Função que busca receitas na API 
    async function fetchRecipes(ingredients) {
        
        // A URL 'findByIngredients' foi usada pra buscar pelo que o usuário tem dentro das receitas disponíveis
        const url = `${RECIPES_BASE_URL}?apiKey=${API_KEY}&ingredients=${ingredients}&number=5`; // Número limitado a 5
        console.log("Buscando na URL:", url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro de API: ${response.statusText} (Status: ${response.status})`);
        }
        
        const data = await response.json();
        return data; // Retorna o array de receitas
    }
    
    // Função async que busca os detalhes da receita por ID (3. Adição)
    async function fetchRecipeDetails(recipeId) {
        const url = `${DETAILS_BASE_URL}/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro de API: ${response.statusText} (Status: ${response.status})`);
        }
        
        const data = await response.json();
        return data;
    }
    
    // Função que gerencia o fluxo de busca e exibição
    async function handleSearch() {
        const ingredients = ingredientInput.value;

        if (ingredients.trim() === "") {
            alert("Por favor, digite os ingredientes.");
            return;
        }

        // Prepara a interface para a busca (4. Correção: Acesso de classes/style)
        if (loader) loader.style.display = 'flex'; 
        // Esconde a área de busca (search-container)
        if (mainContainer) mainContainer.classList.add('hidden'); 
        // Esconde a section de resultados
        if (resultsContainer) resultsContainer.style.display = 'none'; 

        try {
            const recipes = await fetchRecipes(ingredients);
            renderRecipes(recipes);
            
            // Mostra a seção de resultados
            if (resultsContainer) resultsContainer.style.display = 'block';
 
        } 
        catch (error) {
            console.error("Erro ao buscar receitas:", error);
            if (resultsGrid) resultsGrid.innerHTML = "<p>Erro ao buscar receitas. Tente novamente.</p>";
            if (resultsContainer) resultsContainer.style.display = 'block'; 
        } 
        finally {
            if (loader) loader.style.display = 'none';
        }
    }

    /* ==============================
        5 -FUNÇÕES DE RENDERIZAÇÃO
    ============================== */

    // Função que mostra as receitas na tela
    function renderRecipes(recipes) {
        if (!resultsGrid) return; // Garante que o elemento existe
        resultsGrid.innerHTML = '';

        if (recipes.length === 0) {
            resultsGrid.innerHTML = '<p>Nenhuma receita encontrada com esses ingredientes.</p>';
            return;
        }

        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-line'; 
            card.dataset.recipeId = recipe.id;

            card.innerHTML = `
                 <div class="recipe" data-recipe-id="${recipe.id}">
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <h3>${recipe.title}</h3>
                 </div>
            `;
            
            resultsGrid.appendChild(card);
        });
    }

    // Função de Renderização de Detalhes
    function renderRecipeDetails(recipe) {
         // Lógica para preencher recipeDetailsContainer com os dados da receita (título, ingredientes, passos, etc.)
         console.log("Renderizando detalhes para:", recipe.title);
         if (recipeDetailsContainer) {
             recipeDetailsContainer.style = "display: flex;" 
             recipeDetailsContainer.innerHTML = `
                 <h2>${recipe.title}</h2>
                 <p>Pronto em: ${recipe.readyInMinutes} minutos</p>
                 `;
         }
    }
});
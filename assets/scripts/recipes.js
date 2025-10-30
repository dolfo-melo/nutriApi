// Importando API_KEY e DETAILS_BASE_URL do JS principal
import { API_KEY, DETAILS_BASE_URL } from './main.js'; 


/**
 * Busca os detalhes de uma receita, incluindo instruções de preparo.
 * @param {number} recipeId - O ID único da receita.
 * @returns {Promise<Object>} - Os dados detalhados da receita.
 */
export async function fetchRecipeInstructions(recipeId) {
    // Agora API_KEY e DETAILS_BASE_URL estão disponíveis aqui!
    const url = `${DETAILS_BASE_URL}/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=false`;

    // [ ... restante do código da função fetchRecipeInstructions ... ]
    try {
        const response = await fetch(url);
        // ...
    } catch (error) {
        // ...
    }
}
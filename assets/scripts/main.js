/* Arquivo Principal do Script - Deveremos ter módulos e separar as responsabilidades

    .assets -> .script -> vocês irão ver que teram mais de um arquivo *JS*

    Esses arquivos serão os nossos módulos, onde cada um faz uma parte diferente do código e no fim, 
    juntaremos a esse Script principal através de exportação e importação

    Abaixo irei fazer a autenticação da API, para configuração inicial

    // Site Base -> https://spoonacular.com/food-api

    // URL Antiga-> https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&number=5

    // URL Nova -> https://api.spoonacular.com/recipes/716429/information?apiKey=${apiKey}&includeNutrition=true.
*/

const apiKey = "743c537ae764431c95dcfedb456c9054"  // Chave Api
const baseUrl = "https://api.spoonacular.com/recipes/complexSearch" // URL Base
const alimentosPesquisa = document.getElementById("pesquisar")

// Função de conectar API
async function conectarApi() {
    
    // Obtem os valores digitados pelo usuário
    const query = alimentosPesquisa.value 

    // URL completa para conexão com a API
    const completeUrl = `${baseUrl}?apiKey=${apiKey}&query=${query}&number=5`

    let retorno = await fetch(completeUrl)
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
        return data
    })
    .catch(error => {
        console.log(error)
    })

}
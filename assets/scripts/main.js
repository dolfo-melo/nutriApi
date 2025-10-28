/* Arquivo Principal do Script - Deveremos ter módulos e separar as responsabilidades

    .assets -> .script -> vocês irão ver que teram mais de um arquivo *JS*

    Esses arquivos serão os nossos módulos, onde cada um faz uma parte diferente do código e no fim, 
    juntaremos a esse Script principal através de exportação e importação

    Abaixo irei fazer a autenticação da API, para configuração inicial

*/

const apiKey = "1b84cb354ab84c24b33bd83c68442eb0"  // Chave Api
const baseUrl = "https://platform.fatsecret.com/rest/" // URL Base
const alimentosPesquisa = document.getElementById("pesquisar")

// Método para conectar a API
const options = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Header": `Authorization: Bearer ${apiKey}`,
        "Parameters": "method=food.get.v5&food_id=33691&format=json",
        "Acess-Control-Allow-Origin" : "*"
    }
}

// Função de conectar API
async function conectarApi() {
    let retorno = await fetch(`${baseUrl}food/v5?`,options)
        .then(response => {
            if(response.ok) {
                response.json().then((json) =>{
                    console.log(json)
                })
            }
        })
}
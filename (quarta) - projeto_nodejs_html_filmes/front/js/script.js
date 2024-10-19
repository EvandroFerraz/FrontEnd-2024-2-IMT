const baseURL = "http://localhost:3000"
const filmesEndpoint = "/filmes"

async function obterFilmes() {
    const URLCompleta = baseURL + filmesEndpoint
    const filmes = (await axios.get(URLCompleta)).data
    //console.log(filmes)
    let tabela = document.querySelector('.filmes')
    let corpoTabela = tabela.getElementsByTagName('tbody')[0]
    
    for(let filme of filmes){
        let linha = corpoTabela.insertRow(0)
        let celulaTitulo = linha.insertCell(0)
        let celulaSinopse = linha.insertCell(1)
        celulaTitulo.innerHTML = filme.titulo
        celulaSinopse.innerHTML = filme.sinopse
    }
}

async function cadastrarFilme(){
    // definindo o endereço completo
    const URLCompleta = baseURL + filmesEndpoint
    // pegando os elementos de campo de texto da árvore DOM
    let tituloInput = document.querySelector('#tituloInput')
    let sinopseInput = document.querySelector('#sinopseInput')
    // pegamos o valor de cada campo de texto e atribuimos em variaveis
    let titulo = tituloInput.value
    let sinopse = sinopseInput.value

    if(titulo && sinopse){
        // limpando o texto em cada campo de texto
        tituloInput.value = ""
        sinopseInput.value = ""
        // enviando uma requisição do tipo post para o back-end
        // no corpo dessa requisição envia-se o titulo e a sinopse
        // do novo filme que vai ser cadastrado
        // o servidor(back-end) recebe esses dados, processa esses dados,
        // que seria a inclusão do novo filme na lista,
        // e retorna a lista de filmes atualizada como resposta
        // e atribui essa lista atualizada para a constante filmes
        const filmes = (await axios.post(URLCompleta, 
            {titulo, sinopse})).data 
        let tabela = document.querySelector('.filmes')
        let corpoTabela = tabela.getElementsByTagName('tbody')[0]
        // apaga as informações da tabela
        corpoTabela.innerHTML = ""
        for (let filme of filmes) {
            let linha = corpoTabela.insertRow(0)
            let celulaTitulo = linha.insertCell(0)
            let celulaSinopse = linha.insertCell(1)
            celulaTitulo.innerHTML = filme.titulo
            celulaSinopse.innerHTML = filme.sinopse
        }
    }else{ //pelo menos um dos dois campos esta vazio
        let alert = document.querySelector('.alert')
        alert.classList.add('show')
        alert.classList.remove('d-none')
        setTimeout(() => {
            alert.classList.remove('show')
            alert.classList.add('d-none')
        }, 3000)
    }
}

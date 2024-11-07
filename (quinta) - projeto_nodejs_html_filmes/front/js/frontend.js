const baseURL = "http://localhost:3000"
const filmesEndpoint = "/filmes"
const usuarioEndpoint = "/signup"

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

function exibirAlerta(seletor, innerHTML, classesToAdd, classesToRemove){
    let alert = document.querySelector(seletor)
    alert.innerHTML = innerHTML

    // ... = operação de "desmembramento"
    // dividimos os elementos e passamos todos estes elementos de forma individual
    // como parametros para a função add()
    alert.classList.add(...classesToAdd)
    alert.classList.remove(...classesToRemove)

    setTimeout(() => {
        alert.classList.remove('show')
        alert.classList.add('d-none')
    }, 3000)
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
        exibirAlerta('.alert-filme', "Filme cadastrado com sucesso!!",
        ["show","alert-success"], ["d-none", "alert-danger"])
    }else{ //pelo menos um dos dois campos esta vazio
        exibirAlerta('.alert-filme', "Preencha todos os campos!!", 
        ["show","alert-danger"], ["d-none", "alert-success"])
    }
}

async function cadastrarUsuario(){
    let usuarioCadastroInput = 
        document.querySelector("#usuarioCadastroInput")
    let passwordCadastroInput =
        document.querySelector("#passwordCadastroInput")

    let usuarioCadastro = usuarioCadastroInput.value;
    let passwordCadastro = passwordCadastroInput.value;

    // Se os campos usuarioCadastro e ao mesmo tempo passwordCadastro
    // não estiverem vazios
    if(usuarioCadastro && passwordCadastro){  
        try{
            // Fazer a requisição POST para o Backend
            // http://localhost:3000/signup
            const URLCompleta = baseURL + usuarioEndpoint;

            await axios.post(URLCompleta, 
                {login: usuarioCadastro, password: passwordCadastro})
            
           usuarioCadastroInput.value = ""
           passwordCadastroInput.value = "" 

           exibirAlerta('.alert-modal-cadastro', "Usuário Cadastrado com Sucesso!", 
           ['show', 'alert-success'], ['d-none','alert-danger'])

        }catch(error){
            // Um alerta informando o usuário sobre o erro que aconteceu
            exibirAlerta('.alert-modal-cadastro', "Erro ao Cadastrar Usuário!!",
            ['show','alert-danger'], ['d-none','alert-success'])
        }
    }else{ // Pelo menos um dos dois campos esta vazio
        exibirAlerta('.alert-modal-cadastro', "Preencha todos os campos!!",
        ['show','alert-danger'],['d-none','alert-success'])       
    }
}

const fazerLogin = async () => {
    let usuarioLoginInput = document.querySelector('#usuarioLoginInput')
    let passwordLoginInput = document.querySelector('#passwordLoginInput')
    let usuarioLogin = usuarioLoginInput.value
    let passwordLogin = passwordLoginInput.value

    if(usuarioLogin && passwordLogin){
        // Fazer uma requisição do tipo POST do Front para o BackEnd
        // para o endpoint /login, validando se a combinação de usuário e senha
        // está cadastrada no banco de dados
    }else{ // Pelo menos um dos dois campos de texto esta vazio
        exibirAlerta(".alert-modal-login", "Preencha todos os campos!!",
        ["show","alert-danger"],["d-none","alert-success"])
    }
}



// mongodb+srv://evandroferraz:1234@cluster0.vev20.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
console.log("Hello, NodeJS")

const express = require ('express')
const app = express()
app.use(express.json())

const cors = require ('cors')
app.use(cors())

let filmes = [
    {
        titulo: "Forrest Gump - O Contador de Histórias",
        sinopse: "Quarenta anos da história dos Estados Unidos, vistos pelos olhos de Forrest Gump (Tom Hanks), um rapaz com QI abaixo da média e boas intenções."
    },
    {
        titulo: "Um Sonho de Liberdade",
        sinopse: "Em 1946, Andy Dufresne (Tim Robbins), um jovem e bem sucedido banqueiro, tem a sua vida radicalmente modificada ao ser condenado por um crime que nunca cometeu, o homicídio de sua esposa e do amante dela"
    }
]

// carrega as funções do pacote 'mongoose' na constante
const mongoose = require('mongoose')
// cria um Schema para representar filmes
const Filme = mongoose.model("Filme", mongoose.Schema({
    titulo: {type:String},
    sinopse: {type:String}
}))
// cria uma função para fazer a conexão com o MongoDB
async function conectarAoMongoDB(){
    await mongoose.connect("mongodb+srv://evandroferraz:1234@cluster0.vev20.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
}

app.listen(3000, () => {
    try{
        conectarAoMongoDB()
        console.log("up and running")
    }catch(e){
        console.log("Erro", e)
    }
})

//GET http://localhost:3000/hey
app.get('/hey', (req, res) => {
    res.send('hey')
})

//GET http://localhost:3000/filmes
app.get("/filmes", async (req, res) => {
    res.json(filmes)
})

//POST http://localhost:3000/filmes
app.post("/filmes", async (req, res) => {
    //obtém os dados enviados pelo cliente
    const titulo = req.body.titulo
    const sinopse = req.body.sinopse
    //monta um objeto agrupando os dados. Ele representa um novo filme
    const filme = new Filme({titulo: titulo, sinopse: sinopse})
    //adiciona o novo que foi criado a parti do Schema de Filmes
    // já no cluster do MongoDB
    await filme.save()
    // cria a constante que guarda a lista de filmes e carrega esta
    // constante com a lista de filmes encontrada entre as coleções
    // do cluster no mongodb
    const filmes = await Filme.find()
    //responde ao cliente. Aqui, optamos por devolver a base inteira ao cliente, embora não seja obrigatório.
    res.json(filmes)
})
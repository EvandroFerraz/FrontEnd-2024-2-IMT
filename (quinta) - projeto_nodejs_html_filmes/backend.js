// mongodb+srv://evandroferraz:1234@cluster0.vev20.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// npm install mongoose-unique-validator --legacy-peer-deps
// npm install bcrypt --legacy-peer-deps

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

const uniqueValidator = require("mongoose-unique-validator")
const usuarioSchema = mongoose.Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)

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

//POST http://localhost:3000/signup
app.post("/signup", async (req, res) => {
    try{
        const login = req.body.login
        const password = req.body.password
        const criptografada = await bcrypt.hash(password,10)
        const usuario = new Usuario({
            login: login,
            password: criptografada
        })
        const respMongo = await usuario.save()
        console.log(respMongo)
        res.status(201).end()
    }catch(error){
        console.log(error)
        res.status(409).end()
    }
})

//POST http://localhost:3000/login
app.post('/login', async (req, res) => {
    //login/senha que o usuário enviou
    const login = req.body.login
    const password = req.body.password
    //tentamos encontrar no MongoDB
    const u = await Usuario.findOne({login: req.body.login})
    if(!u){
        //senão foi encontrado, encerra por aqui com código 401
        return res.status(401).json({mensagem: "login inválido"})
    }
    //se foi encontrado, comparamos a senha, após descriptográ-la
    const senhaValida = await bcrypt.compare(password, u.password)
    if (!senhaValida){
        return res.status(401).json({mensagem: "senha inválida"})
    }
    //deixa assim por enquanto, já já arrumamos
    res.end()
})
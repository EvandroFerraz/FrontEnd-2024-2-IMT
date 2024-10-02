const baseURL = "http://localhost:3000"
const filmesEndpoint = "/filmes"

async function obterFilmes() {
    const URLCompleta = baseURL + filmesEndpoint
    const filmes = (await app.get(URLCompleta)).data
    console.log(filmes)
}
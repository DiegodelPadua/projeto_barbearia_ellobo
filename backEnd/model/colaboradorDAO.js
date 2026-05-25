const fs = require('fs')
const path = require('path')

const caminhoArquivo = path.join(__dirname, '../database/colaboradores.json')

const selectColaboradores = async function () {
    const dados = fs.readFileSync(caminhoArquivo, 'utf-8')
    return JSON.parse(dados)
}

const buscarColaboradorPorEmail = async function (email) {
    const colaboradores = await selectColaboradores()

    return colaboradores.find(function (colaborador) {
        return colaborador.email === email
    })
}

module.exports = {
    selectColaboradores,
    buscarColaboradorPorEmail
}
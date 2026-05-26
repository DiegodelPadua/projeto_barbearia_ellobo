const fs = require('fs')
const path = require('path')

const caminhoArquivo = path.join(__dirname, '../database/bloqueios.json')

const selectBloqueios = async function () {
    const dados = fs.readFileSync(caminhoArquivo, 'utf-8')
    return JSON.parse(dados)
}

const insertBloqueio = async function (bloqueio) {
    try {
        const bloqueios = await selectBloqueios()

        bloqueios.push(bloqueio)

        fs.writeFileSync(caminhoArquivo, JSON.stringify(bloqueios, null, 4))

        return true

    } catch (error) {
        console.log('ERRO NO DAO insertBloqueio:', error)
        return false
    }
}

const deleteBloqueio = async function (id) {
    try {
        const bloqueios = await selectBloqueios()

        const novosBloqueios = bloqueios.filter(function (bloqueio) {
            return bloqueio.id != id
        })

        if (novosBloqueios.length === bloqueios.length) {
            return false
        }

        fs.writeFileSync(caminhoArquivo, JSON.stringify(novosBloqueios, null, 4))

        return true

    } catch (error) {
        console.log('ERRO NO DAO deleteBloqueio:', error)
        return false
    }
}

module.exports = {
    selectBloqueios,
    insertBloqueio,
    deleteBloqueio
}
const fs = require('fs')
const path = require('path')

const caminhoArquivo = path.join(__dirname, '../database/servicos.json')

const selectServicos = async function () {
    const dados = fs.readFileSync(caminhoArquivo, 'utf-8')
    return JSON.parse(dados)
}

const insertServico = async function (servico) {
    try {
        const servicos = await selectServicos()

        servicos.push(servico)

        fs.writeFileSync(caminhoArquivo, JSON.stringify(servicos, null, 4))

        return true
    } catch (error) {
        console.log('ERRO NO DAO insertServico:', error)
        return false
    }
}

const updateServico = async function (id, servicoAtualizado) {
    try {
        const servicos = await selectServicos()

        const index = servicos.findIndex(function (servico) {
            return servico.id == id
        })

        if (index === -1) {
            return false
        }

        servicos[index] = {
            ...servicos[index],
            ...servicoAtualizado
        }

        fs.writeFileSync(caminhoArquivo, JSON.stringify(servicos, null, 4))

        return true
    } catch (error) {
        console.log('ERRO NO DAO updateServico:', error)
        return false
    }
}

const deleteServico = async function (id) {
    try {
        const servicos = await selectServicos()

        const novosServicos = servicos.filter(function (servico) {
            return servico.id != id
        })

        if (novosServicos.length === servicos.length) {
            return false
        }

        fs.writeFileSync(caminhoArquivo, JSON.stringify(novosServicos, null, 4))

        return true
    } catch (error) {
        console.log('ERRO NO DAO deleteServico:', error)
        return false
    }
}

module.exports = {
    selectServicos,
    insertServico,
    updateServico,
    deleteServico
}
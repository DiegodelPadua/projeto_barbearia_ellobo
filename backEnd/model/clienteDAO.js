const fs = require('fs')
const path = require('path')

const caminhoArquivo = path.join(__dirname, '../database/clientes.json')

const selectClientes = async function () {
    const dados = fs.readFileSync(caminhoArquivo, 'utf-8')
    return JSON.parse(dados)
}

const insertCliente = async function (cliente) {
    try {
        const clientes = await selectClientes()

        clientes.push(cliente)

        fs.writeFileSync(caminhoArquivo, JSON.stringify(clientes, null, 4))

        return true

    } catch (error) {
        console.log('ERRO NO DAO insertCliente:', error)
        return false
    }
}

const buscarClientePorEmail = async function (email) {
    const clientes = await selectClientes()

    return clientes.find(function (cliente) {
        return cliente.email === email
    })
}

module.exports = {
    selectClientes,
    insertCliente,
    buscarClientePorEmail
}
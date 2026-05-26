const fs = require('fs')
const path = require('path')

const caminhoArquivo = path.join(__dirname, '../database/agendamentos.json')

const selectAgendamentos = async function () {
    const dados = fs.readFileSync(caminhoArquivo, 'utf-8')
    return JSON.parse(dados)
}

const insertAgendamento = async function (agendamento) {
    try {
        const agendamentos = await selectAgendamentos()

        agendamentos.push(agendamento)

        fs.writeFileSync(caminhoArquivo, JSON.stringify(agendamentos, null, 4))

        return true

    } catch (error) {
        console.log('ERRO NO DAO insertAgendamento:', error)
        return false
    }
}

const buscarAgendamentoPorDataHorario = async function (data, horario) {
    const agendamentos = await selectAgendamentos()

    return agendamentos.find(function (agendamento) {
        return agendamento.data === data && agendamento.horario === horario
    })
}

module.exports = {
    selectAgendamentos,
    insertAgendamento,
    buscarAgendamentoPorDataHorario
}
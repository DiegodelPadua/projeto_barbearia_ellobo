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

const buscarAgendamentoPorDataHorario = async function(data, horario){
    const agendamentos = await selectAgendamentos()

    return agendamentos.find(function(agendamento){
        return agendamento.data === data &&
               agendamento.horario === horario &&
               agendamento.statusAgendamento === 'confirmado'
    })
}

const cancelarAgendamento = async function(id){
    try {
        const agendamentos = await selectAgendamentos()

        const index = agendamentos.findIndex(function(agendamento){
            return agendamento.id == id
        })

        if(index === -1){
            return false
        }

        agendamentos[index].statusAgendamento = 'cancelado'

        fs.writeFileSync(caminhoArquivo, JSON.stringify(agendamentos, null, 4))

        return true

    } catch(error) {
        console.log('ERRO NO DAO cancelarAgendamento:', error)
        return false
    }
}

const reagendarAgendamento = async function(id, novaData, novoHorario){
    try {
        const agendamentos = await selectAgendamentos()

        const index = agendamentos.findIndex(function(agendamento){
            return agendamento.id == id
        })

        if(index === -1){
            return false
        }

        agendamentos[index].data = novaData
        agendamentos[index].horario = novoHorario
        agendamentos[index].statusAgendamento = 'confirmado'

        fs.writeFileSync(caminhoArquivo, JSON.stringify(agendamentos, null, 4))

        return true

    } catch(error) {
        console.log('ERRO NO DAO reagendarAgendamento:', error)
        return false
    }
}


module.exports = {
    selectAgendamentos,
    insertAgendamento,
    buscarAgendamentoPorDataHorario,
    cancelarAgendamento,
    reagendarAgendamento
}
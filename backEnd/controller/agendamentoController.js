const agendamentoDAO = require('../model/agendamentoDAO')

const criarAgendamento = async function (request, response) {
    const { nome, email, telefone } = request.body

    if (!nome || !email || !telefone) {
        return response.status(400).json({
            status: false,
            message: 'Nome, email e telefone são obrigatórios.'
        })
    }

    const novoAgendamento = {
        id: Date.now(),
        nome,
        email,
        telefone,
        dataCadastro: new Date().toLocaleString('pt-BR')
    }

    const resultado = await agendamentoDAO.insertAgendamento(novoAgendamento)

    if (resultado) {
        return response.status(201).json({
            status: true,
            message: 'Agendamento criado com sucesso.',
            agendamento: novoAgendamento
        })
    }

    return response.status(500).json({
        status: false,
        message: 'Erro interno ao salvar agendamento.'
    })
}

const listarAgendamentos = async function (request, response) {
    const agendamentos = await agendamentoDAO.selectAgendamentos()

    return response.status(200).json({
        status: true,
        quantidade: agendamentos.length,
        agendamentos
    })
}

module.exports = {
    criarAgendamento,
    listarAgendamentos
}
const agendamentoDAO = require('../model/agendamentoDAO')
const clienteDAO = require('../model/clienteDAO')
const servicoDAO = require('../model/servicoDAO')
const bloqueioDAO = require('../model/bloqueioDAO')

const listarAgendamentos = async function (request, response) {
    const agendamentos = await agendamentoDAO.selectAgendamentos()

    return response.status(200).json({
        status: true,
        quantidade: agendamentos.length,
        agendamentos
    })
}

const criarAgendamento = async function (request, response) {
    const { idCliente, idServico, data, horario } = request.body

    if (!idCliente || !idServico || !data || !horario) {
        return response.status(400).json({
            status: false,
            message: 'Cliente, serviço, data e horário são obrigatórios.'
        })
    }

    const clientes = await clienteDAO.selectClientes()
    const cliente = clientes.find(function (cliente) {
        return cliente.id == idCliente
    })

    if (!cliente) {
        return response.status(404).json({
            status: false,
            message: 'Cliente não encontrado.'
        })
    }

    const servicos = await servicoDAO.selectServicos()
    const servico = servicos.find(function (servico) {
        return servico.id == idServico
    })

    if (!servico) {
        return response.status(404).json({
            status: false,
            message: 'Serviço não encontrado.'
        })
    }

    const bloqueios = await bloqueioDAO.selectBloqueios()

    const horarioBloqueado = bloqueios.find(function (bloqueio) {
        return bloqueio.data === data &&
        (
            bloqueio.diaInteiro === true ||
            bloqueio.horario === horario
        )
    })

    if (horarioBloqueado) {
        return response.status(409).json({
            status: false,
            message: 'Este horário está bloqueado.'
        })
    }

    const agendamentoExiste = await agendamentoDAO.buscarAgendamentoPorDataHorario(data, horario)

    if (agendamentoExiste) {
        return response.status(409).json({
            status: false,
            message: 'Este horário já possui agendamento.'
        })
    }

    const novoAgendamento = {
        id: Date.now(),
        cliente: {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email
        },
        servico: {
            id: servico.id,
            nome: servico.nome,
            preco: servico.preco,
            duracao: servico.duracao
        },
        data,
        horario,
        statusAgendamento: 'confirmado',
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
        message: 'Erro ao criar agendamento.'
    })
}

module.exports = {
    listarAgendamentos,
    criarAgendamento
}
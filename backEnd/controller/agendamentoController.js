const agendamentoDAO = require('../model/agendamentoDAO')
const clienteDAO = require('../model/clienteDAO')
const servicoDAO = require('../model/servicoDAO')
const bloqueioDAO = require('../model/bloqueioDAO')

const listarAgendamentos = async function (request, response) {
    // O servidor filtra os registros; o navegador não recebe dados de outros clientes.
    const todos = await agendamentoDAO.selectAgendamentos()
    const agendamentos = request.usuario.tipo === 'admin' ? todos
        : todos.filter(item => String(item.cliente.id) === String(request.usuario.id))

    return response.status(200).json({
        status: true,
        quantidade: agendamentos.length,
        agendamentos
    })
}

const criarAgendamento = async function(request, response){
    const { idServico, data, horario } = request.body
    const idCliente = request.usuario.tipo === 'admin' ? request.body.idCliente : request.usuario.id

    if(!idCliente || !idServico || !data || !horario){
        return response.status(400).json({
            status: false,
            message: 'Cliente, serviço, data e horário são obrigatórios.'
        })
    }

    const clientes = await clienteDAO.selectClientes()

    const cliente = clientes.find(function(cliente){
        return cliente.id == idCliente
    })

    if(!cliente){
        return response.status(404).json({
            status: false,
            message: 'Cliente não encontrado.'
        })
    }

    const servicos = await servicoDAO.selectServicos()

    const servico = servicos.find(function(servico){
        return servico.id == idServico
    })

    if(!servico){
        return response.status(404).json({
            status: false,
            message: 'Serviço não encontrado.'
        })
    }

    const agendamentoExiste = await agendamentoDAO.buscarAgendamentoPorDataHorario(data, horario)

    if(agendamentoExiste && agendamentoExiste.statusAgendamento !== 'cancelado'){
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
            email: cliente.email,
            telefone: cliente.telefone
        },

        servico: {
            id: servico.id,
            nome: servico.nome,
            preco: servico.preco,
            duracao: servico.duracao
        },

        data: data,
        horario: horario,
        statusAgendamento: 'confirmado',
        dataCadastro: new Date().toLocaleString('pt-BR')
    }

    const resultado = await agendamentoDAO.insertAgendamento(novoAgendamento)

    if (resultado === 'conflito') return response.status(409).json({message: 'Este horário já possui agendamento.'})

    if(resultado){
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

const cancelarAgendamento = async function(request, response){
    const id = request.params.id
    const registros = await agendamentoDAO.selectAgendamentos()
    const registro = registros.find(item => String(item.id) === String(id))
    if (!registro || (request.usuario.tipo !== 'admin' && String(registro.cliente.id) !== String(request.usuario.id))) {
        return response.status(404).json({message: 'Agendamento não encontrado.'})
    }

    const resultado = await agendamentoDAO.cancelarAgendamento(id)

    if (resultado === 'conflito') return response.status(409).json({message: 'Este horário já possui agendamento.'})

    if(resultado){
        return response.status(200).json({
            status: true,
            message: 'Agendamento cancelado com sucesso.'
        })
    }

    return response.status(404).json({
        status: false,
        message: 'Agendamento não encontrado.'
    })
}

const reagendarAgendamento = async function(request, response){
    const id = request.params.id
    const registros = await agendamentoDAO.selectAgendamentos()
    const registro = registros.find(item => String(item.id) === String(id))
    if (!registro || (request.usuario.tipo !== 'admin' && String(registro.cliente.id) !== String(request.usuario.id))) {
        return response.status(404).json({message: 'Agendamento não encontrado.'})
    }
    const { data, horario } = request.body

    if(!data || !horario){
        return response.status(400).json({
            status: false,
            message: 'Nova data e novo horário são obrigatórios.'
        })
    }

    const agendamentoExiste = await agendamentoDAO.buscarAgendamentoPorDataHorario(data, horario)

    if(agendamentoExiste && agendamentoExiste.statusAgendamento !== 'cancelado'){
        return response.status(409).json({
            status: false,
            message: 'Este horário já possui agendamento.'
        })
    }

    const resultado = await agendamentoDAO.reagendarAgendamento(id, data, horario)

    if (resultado === 'conflito') return response.status(409).json({message: 'Este horário já possui agendamento.'})

    if(resultado){
        return response.status(200).json({
            status: true,
            message: 'Agendamento reagendado com sucesso.'
        })
    }

    return response.status(404).json({
        status: false,
        message: 'Agendamento não encontrado.'
    })
}
const deletarAgendamento = async function(request, response){
    const id = request.params.id

    const resultado = await agendamentoDAO.deletarAgendamento(id)

    if (resultado === 'conflito') return response.status(409).json({message: 'Este horário já possui agendamento.'})

    if(resultado){
        return response.status(200).json({
            status: true,
            message: 'Agendamento removido definitivamente.'
        })
    }

    return response.status(404).json({
        status: false,
        message: 'Agendamento não encontrado.'
    })
}

module.exports = {
    listarAgendamentos,
    criarAgendamento,
    cancelarAgendamento,
    reagendarAgendamento,
    deletarAgendamento 
}
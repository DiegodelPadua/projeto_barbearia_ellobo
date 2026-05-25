const servicoDAO = require('../model/servicoDAO')

const listarServicos = async function (request, response) {
    const servicos = await servicoDAO.selectServicos()

    return response.status(200).json({
        status: true,
        quantidade: servicos.length,
        servicos
    })
}

const criarServico = async function (request, response) {
    const { nome, preco, duracao } = request.body

    if (!nome || !preco || !duracao) {
        return response.status(400).json({
            status: false,
            message: 'Nome, preço e duração são obrigatórios.'
        })
    }

    const servicos = await servicoDAO.selectServicos()

    const novoServico = {
        id: Date.now(),
        nome,
        preco,
        duracao
    }

    const resultado = await servicoDAO.insertServico(novoServico)

    if (resultado) {
        return response.status(201).json({
            status: true,
            message: 'Serviço criado com sucesso.',
            servico: novoServico
        })
    }

    return response.status(500).json({
        status: false,
        message: 'Erro ao criar serviço.'
    })
}

const atualizarServico = async function (request, response) {
    const id = request.params.id
    const { nome, preco, duracao } = request.body

    if (!nome && !preco && !duracao) {
        return response.status(400).json({
            status: false,
            message: 'Informe ao menos um campo para atualizar.'
        })
    }

    const servicoAtualizado = {}

    if (nome) servicoAtualizado.nome = nome
    if (preco) servicoAtualizado.preco = preco
    if (duracao) servicoAtualizado.duracao = duracao

    const resultado = await servicoDAO.updateServico(id, servicoAtualizado)

    if (resultado) {
        return response.status(200).json({
            status: true,
            message: 'Serviço atualizado com sucesso.'
        })
    }

    return response.status(404).json({
        status: false,
        message: 'Serviço não encontrado.'
    })
}

const deletarServico = async function (request, response) {
    const id = request.params.id

    const resultado = await servicoDAO.deleteServico(id)

    if (resultado) {
        return response.status(200).json({
            status: true,
            message: 'Serviço deletado com sucesso.'
        })
    }

    return response.status(404).json({
        status: false,
        message: 'Serviço não encontrado.'
    })
}

module.exports = {
    listarServicos,
    criarServico,
    atualizarServico,
    deletarServico
}
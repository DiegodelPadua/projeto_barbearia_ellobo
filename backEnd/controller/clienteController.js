const clienteDAO = require('../model/clienteDAO')

const criarConta = async function (request, response) {
    const { nome, email, senha } = request.body

    if (!nome || !email || !senha) {
        return response.status(400).json({
            status: false,
            message: 'Nome, email e senha são obrigatórios.'
        })
    }

    const clienteExiste = await clienteDAO.buscarClientePorEmail(email)

    if (clienteExiste) {
        return response.status(409).json({
            status: false,
            message: 'Este email já está cadastrado.'
        })
    }

    const novoCliente = {
        id: Date.now(),
        nome,
        email,
        senha,
        dataCadastro: new Date().toLocaleString('pt-BR')
    }

    const resultado = await clienteDAO.insertCliente(novoCliente)

    if (resultado) {
        return response.status(201).json({
            status: true,
            message: 'Conta criada com sucesso.',
            cliente: {
                id: novoCliente.id,
                nome: novoCliente.nome,
                email: novoCliente.email
            }
        })
    }

    return response.status(500).json({
        status: false,
        message: 'Erro ao criar conta.'
    })
}

const loginCliente = async function (request, response) {
    const { email, senha } = request.body

    if (!email || !senha) {
        return response.status(400).json({
            status: false,
            message: 'Email e senha são obrigatórios.'
        })
    }

    const cliente = await clienteDAO.buscarClientePorEmail(email)

    if (!cliente || cliente.senha !== senha) {
        return response.status(401).json({
            status: false,
            message: 'Email ou senha inválidos.'
        })
    }

    return response.status(200).json({
        status: true,
        message: 'Login realizado com sucesso.',
        cliente: {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email
        }
    })
}

const listarClientes = async function (request, response) {
    const clientes = await clienteDAO.selectClientes()

    return response.status(200).json({
        status: true,
        quantidade: clientes.length,
        clientes
    })
}

module.exports = {
    criarConta,
    loginCliente,
    listarClientes
}
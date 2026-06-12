const clienteDAO = require('../model/clienteDAO')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'chave_secreta_el_lobo'

const criarConta = async function (request, response) {

    console.log('Entrou na função criarConta')
    console.log(request.body)

    const { nome, email, telefone, senha } = request.body

    if (!nome || !email || !telefone || !senha) {
        return response.status(400).json({
            status: false,
            message: 'Nome, email, telefone e senha são obrigatórios.'
        })
    }

    const clienteExiste = await clienteDAO.buscarClientePorEmail(email)

    if (clienteExiste) {
        return response.status(409).json({
            status: false,
            message: 'Este email já está cadastrado.'
        })
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const novoCliente = {
        id: Date.now(),
        nome,
        email,
        telefone,
        senha: senhaCriptografada,
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
                email: novoCliente.email,
                telefone: novoCliente.telefone
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

    if (!cliente) {
        return response.status(401).json({
            status: false,
            message: 'Email ou senha inválidos.'
        })
    }

    const senhaCorreta = await bcrypt.compare(senha, cliente.senha)

    if (!senhaCorreta) {
        return response.status(401).json({
            status: false,
            message: 'Email ou senha inválidos.'
        })
    }

    const token = jwt.sign(
        {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email
        },
        JWT_SECRET,
        {
            expiresIn: '2h'
        }
    )

    return response.status(200).json({
        status: true,
        message: 'Login realizado com sucesso.',
        token,
        cliente: {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            telefone: cliente.telefone
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
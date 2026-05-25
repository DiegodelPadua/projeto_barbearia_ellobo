const colaboradorDAO = require('../model/colaboradorDAO')

const listarColaboradores = async function (request, response) {
    const colaboradores = await colaboradorDAO.selectColaboradores()

    return response.status(200).json({
        status: true,
        quantidade: colaboradores.length,
        colaboradores
    })
}

const loginColaborador = async function (request, response) {
    const { email, senha } = request.body

    if (!email || !senha) {
        return response.status(400).json({
            status: false,
            message: 'Email e senha são obrigatórios.'
        })
    }

    const colaborador = await colaboradorDAO.buscarColaboradorPorEmail(email)

    if (!colaborador || colaborador.senha !== senha) {
        return response.status(401).json({
            status: false,
            message: 'Email ou senha inválidos.'
        })
    }

    return response.status(200).json({
        status: true,
        message: 'Login realizado com sucesso.',
        colaborador: {
            id: colaborador.id,
            nome: colaborador.nome,
            email: colaborador.email,
            cargo: colaborador.cargo
        }
    })
}

module.exports = {
    listarColaboradores,
    loginColaborador
}
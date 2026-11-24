const colaboradorDAO = require('../model/colaboradorDAO')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const JWT_SECRET = require('../config/jwt')
// Em produção, credenciais vêm do painel da hospedagem, nunca do GitHub.
const adminEmail = process.env.ADMIN_EMAIL
const adminHash = process.env.ADMIN_PASSWORD ? bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12) : null
if (process.env.NODE_ENV === 'production' && (!adminEmail || !adminHash || process.env.ADMIN_PASSWORD.length < 16)) {
    throw new Error('Configure ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 16 caracteres).')
}


const listarColaboradores = async function (request, response) {
    const colaboradores = await colaboradorDAO.selectColaboradores()

    return response.status(200).json({
        status: true,
        quantidade: colaboradores.length,
        colaboradores: colaboradores.map(({ senha, ...colaborador }) => colaborador)
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

    const colaborador = adminEmail && adminHash
        ? (email === adminEmail ? {id: 1, nome: 'Administrador', email: adminEmail, cargo: 'Administrador', senha: adminHash} : null)
        : await colaboradorDAO.buscarColaboradorPorEmail(email)
    const senhaCorreta = colaborador && (adminHash || colaborador.senha.startsWith('$2')
        ? await bcrypt.compare(senha, colaborador.senha)
        : process.env.NODE_ENV !== 'production' && colaborador.senha === senha)

    if (!senhaCorreta) {
        return response.status(401).json({
            status: false,
            message: 'Email ou senha inválidos.'
        })
    }
    const token = jwt.sign(
        {
            id: colaborador.id,
            nome: colaborador.nome,
            email: colaborador.email,
            tipo: 'admin'
        },
        JWT_SECRET,
        {
            expiresIn: '2h'
        }
    )

    return response.status(200).json({
        status: true,
        token,
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
const express = require('express')
const router = express.Router()

const autenticacao = require('../middlewares/autenticacao')

const clienteController = require('../controller/clienteController')

router.get(
    '/',
    autenticacao.validarTokenAdmin,
    clienteController.listarClientes
)

router.post('/cadastro', clienteController.criarConta)

router.post('/login', clienteController.loginCliente)

module.exports = router
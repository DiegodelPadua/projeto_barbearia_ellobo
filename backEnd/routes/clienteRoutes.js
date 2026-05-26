const express = require('express')
const router = express.Router()

const clienteController = require('../controller/clienteController')

router.get('/', clienteController.listarClientes)
router.post('/cadastro', clienteController.criarConta)
router.post('/login', clienteController.loginCliente)

module.exports = router
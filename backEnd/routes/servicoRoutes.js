const autenticacao = require('../middlewares/autenticacao')
const express = require('express')
const router = express.Router()

const servicoController = require('../controller/servicoController')

router.get('/', servicoController.listarServicos)
router.post('/', autenticacao.validarTokenAdmin, servicoController.criarServico)
router.put('/:id', autenticacao.validarTokenAdmin, servicoController.atualizarServico)
router.delete('/:id', autenticacao.validarTokenAdmin, servicoController.deletarServico)

module.exports = router
const express = require('express')
const router = express.Router()

const servicoController = require('../controller/servicoController')

router.get('/', servicoController.listarServicos)
router.post('/', servicoController.criarServico)
router.put('/:id', servicoController.atualizarServico)
router.delete('/:id', servicoController.deletarServico)

module.exports = router
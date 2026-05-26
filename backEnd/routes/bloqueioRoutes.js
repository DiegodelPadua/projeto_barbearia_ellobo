const express = require('express')
const router = express.Router()

const bloqueioController = require('../controller/bloqueioController')

router.get('/', bloqueioController.listarBloqueios)
router.post('/', bloqueioController.criarBloqueio)
router.delete('/:id', bloqueioController.deletarBloqueio)

module.exports = router
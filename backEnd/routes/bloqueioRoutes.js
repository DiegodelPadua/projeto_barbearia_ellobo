const express = require('express')
const router = express.Router()

const autenticacao = require('../middlewares/autenticacao')

const bloqueioController = require('../controller/bloqueioController')

router.get('/', bloqueioController.listarBloqueios)

router.post(
    '/',
    autenticacao.validarTokenAdmin,
    bloqueioController.criarBloqueio
)

router.delete(
    '/:id',
    autenticacao.validarTokenAdmin,
    bloqueioController.deletarBloqueio
)

module.exports = router
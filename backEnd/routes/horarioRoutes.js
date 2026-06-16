const express = require('express')
const router = express.Router()

const autenticacao = require('../middlewares/autenticacao')

const horarioController = require('../controller/horarioController')

router.get('/', horarioController.listarHorarios)

router.get(
    '/disponiveis',
    horarioController.listarHorariosDisponiveis
)

router.put(
    '/:id',
    autenticacao.validarTokenAdmin,
    horarioController.atualizarHorario
)

module.exports = router
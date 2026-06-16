const express = require('express')
const router = express.Router()

const autenticacao = require('../middlewares/autenticacao')
const agendamentoController = require('../controller/agendamentoController')

router.get('/', agendamentoController.listarAgendamentos)

router.post('/', agendamentoController.criarAgendamento)

router.put('/:id/cancelar', agendamentoController.cancelarAgendamento)

router.put('/:id/reagendar', agendamentoController.reagendarAgendamento)

router.put(
    '/:id/remover-admin',
    autenticacao.validarTokenAdmin,
    agendamentoController.cancelarAgendamento
)

module.exports = router
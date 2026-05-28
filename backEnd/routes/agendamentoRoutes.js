const express = require('express')
const router = express.Router()

const agendamentoController = require('../controller/agendamentoController')

router.get('/', agendamentoController.listarAgendamentos)
router.post('/', agendamentoController.criarAgendamento)
router.put('/:id/cancelar', agendamentoController.cancelarAgendamento)
router.put('/:id/reagendar', agendamentoController.reagendarAgendamento)

module.exports = router
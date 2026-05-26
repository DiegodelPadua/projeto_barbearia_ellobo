const express = require('express')
const router = express.Router()

const agendamentoController = require('../controller/agendamentoController')

router.get('/', agendamentoController.listarAgendamentos)
router.post('/', agendamentoController.criarAgendamento)

module.exports = router
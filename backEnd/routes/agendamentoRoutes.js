const express = require('express')
const router = express.Router()

const agendamentoController = require('../controller/agendamentoController')

router.post('/', agendamentoController.criarAgendamento)
router.get('/', agendamentoController.listarAgendamentos)

module.exports = router
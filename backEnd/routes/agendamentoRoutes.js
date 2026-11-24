const express = require('express')
const router = express.Router()

const autenticacao = require('../middlewares/autenticacao')
const agendamentoController = require('../controller/agendamentoController')

router.get('/', autenticacao.validarToken, agendamentoController.listarAgendamentos)

router.post('/', autenticacao.validarToken, agendamentoController.criarAgendamento)

router.put('/:id/cancelar', autenticacao.validarToken, agendamentoController.cancelarAgendamento)

router.put('/:id/reagendar', autenticacao.validarToken, agendamentoController.reagendarAgendamento)

router.put(
    '/:id/remover-admin',
    autenticacao.validarTokenAdmin,
    agendamentoController.cancelarAgendamento
)
router.delete(
    '/:id/remover-admin',
    autenticacao.validarTokenAdmin,
    agendamentoController.deletarAgendamento
)

module.exports = router
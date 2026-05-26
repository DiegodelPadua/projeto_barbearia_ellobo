const express = require('express')
const router = express.Router()

const horarioController = require('../controller/horarioController')

router.get('/', horarioController.listarHorarios)
router.get('/disponiveis', horarioController.listarHorariosDisponiveis)
router.put('/:id', horarioController.atualizarHorario)

module.exports = router
const express = require('express')
const router = express.Router()

const colaboradorController = require('../controller/colaboradorController')

router.get('/', colaboradorController.listarColaboradores)
router.post('/login', colaboradorController.loginColaborador)

module.exports = router
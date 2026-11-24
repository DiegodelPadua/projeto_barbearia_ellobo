const express = require('express')
const router = express.Router()

const colaboradorController = require('../controller/colaboradorController')

router.get('/', require('../middlewares/autenticacao').validarTokenAdmin, colaboradorController.listarColaboradores)
router.post('/login', colaboradorController.loginColaborador)

module.exports = router
require('dotenv').config()
const path = require('path')
require('./config/jwt')
// Não iniciar produção com os JSON dentro da pasta substituída no deploy.
if (process.env.NODE_ENV === 'production' && (!process.env.DATA_DIR || !path.isAbsolute(process.env.DATA_DIR))) {
    throw new Error('Configure DATA_DIR absoluto em armazenamento persistente antes de publicar.')
}
const express = require('express')
const cors = require('cors')

const servicoRoutes = require('./routes/servicoRoutes')
const colaboradorRoutes = require('./routes/colaboradorRoutes')
const horarioRoutes = require('./routes/horarioRoutes')
const bloqueioRoutes = require('./routes/bloqueioRoutes')
const clienteRoutes = require('./routes/clienteRoutes')
const agendamentoRoutes = require('./routes/agendamentoRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/servicos', servicoRoutes)
app.use('/colaboradores', colaboradorRoutes)
app.use('/horarios', horarioRoutes)
app.use('/bloqueios', bloqueioRoutes)
app.use('/clientes', clienteRoutes)
app.use('/agendamentos', agendamentoRoutes)

// Serve somente o front-end, sem expor código ou arquivos de dados.
app.use(express.static(path.join(__dirname, '../frontEnd')))

const porta = process.env.PORT || 8080
app.listen(porta, '0.0.0.0', function () {
    console.log(`EL LOBO iniciado na porta ${porta}`)
})
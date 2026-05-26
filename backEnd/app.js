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

app.listen(8080, function () {
    console.log('API da Barbearia EL LOBO rodando na porta 8080')
})
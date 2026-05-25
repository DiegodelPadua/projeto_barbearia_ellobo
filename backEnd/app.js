const express = require('express')
const cors = require('cors')

const servicoRoutes = require('./routes/servicoRoutes')
const colaboradorRoutes = require('./routes/colaboradorRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/servicos', servicoRoutes)
app.use('/colaboradores', colaboradorRoutes)

app.listen(8080, function () {
    console.log('API da Barbearia EL LOBO rodando na porta 8080')
})
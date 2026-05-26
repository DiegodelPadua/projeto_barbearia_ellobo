const fs = require('fs')
const path = require('path')

const caminhoArquivo = path.join(__dirname, '../database/horarios.json')

const selectHorarios = async function () {
    const dados = fs.readFileSync(caminhoArquivo, 'utf-8')
    return JSON.parse(dados)
}

const buscarHorarioPorId = async function (id) {
    const horarios = await selectHorarios()

    return horarios.find(function (horario) {
        return horario.id == id
    })
}

const updateHorario = async function (id, horarioAtualizado) {
    try {
        const horarios = await selectHorarios()

        const index = horarios.findIndex(function (horario) {
            return horario.id == id
        })

        if (index === -1) {
            return false
        }

        horarios[index] = {
            ...horarios[index],
            ...horarioAtualizado
        }

        fs.writeFileSync(caminhoArquivo, JSON.stringify(horarios, null, 4))

        return true

    } catch (error) {
        console.log('ERRO NO DAO updateHorario:', error)
        return false
    }
}

module.exports = {
    selectHorarios,
    buscarHorarioPorId,
    updateHorario
}
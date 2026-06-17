const bloqueioDAO = require('../model/bloqueioDAO')

const listarBloqueios = async function (request, response) {
    const bloqueios = await bloqueioDAO.selectBloqueios()

    return response.status(200).json({
        status: true,
        quantidade: bloqueios.length,
        bloqueios
    })
}

const criarBloqueio = async function (request, response) {
    const { data, horarioInicio, horarioFim, diaInteiro, motivo } = request.body

    if (!data) {
        return response.status(400).json({
            status: false,
            message: 'A data é obrigatória.'
        })
    }

    if (!diaInteiro && (!horarioInicio || !horarioFim)) {
        return response.status(400).json({
            status: false,
            message: 'Informe o horário inicial e o horário final do bloqueio.'
        })
    }

    if (!diaInteiro && horarioInicio >= horarioFim) {
        return response.status(400).json({
            status: false,
            message: 'O horário inicial deve ser menor que o horário final.'
        })
    }

    const novoBloqueio = {
        id: Date.now(),
        data,
        horarioInicio: diaInteiro ? null : horarioInicio,
        horarioFim: diaInteiro ? null : horarioFim,
        diaInteiro: diaInteiro === true,
        motivo: motivo || 'Bloqueio criado pelo colaborador'
    }

    const resultado = await bloqueioDAO.insertBloqueio(novoBloqueio)

    if (resultado) {
        return response.status(201).json({
            status: true,
            message: 'Bloqueio criado com sucesso.',
            bloqueio: novoBloqueio
        })
    }

    return response.status(500).json({
        status: false,
        message: 'Erro ao criar bloqueio.'
    })
}

const deletarBloqueio = async function (request, response) {
    const id = request.params.id

    const resultado = await bloqueioDAO.deleteBloqueio(id)

    if (resultado) {
        return response.status(200).json({
            status: true,
            message: 'Bloqueio removido com sucesso.'
        })
    }

    return response.status(404).json({
        status: false,
        message: 'Bloqueio não encontrado.'
    })
}

module.exports = {
    listarBloqueios,
    criarBloqueio,
    deletarBloqueio
}
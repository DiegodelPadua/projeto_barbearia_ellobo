const horarioDAO = require('../model/horarioDAO')
const bloqueioDAO = require('../model/bloqueioDAO')
const agendamentoDAO = require('../model/agendamentoDAO')

const listarHorarios = async function (request, response) {
    const horarios = await horarioDAO.selectHorarios()

    return response.status(200).json({
        status: true,
        quantidade: horarios.length,
        horarios
    })
}

const atualizarHorario = async function (request, response) {
    const id = request.params.id
    const { inicio, fim, intervalo, trabalha } = request.body

    if (
        inicio === undefined &&
        fim === undefined &&
        intervalo === undefined &&
        trabalha === undefined
    ) {
        return response.status(400).json({
            status: false,
            message: 'Informe ao menos um campo para atualizar.'
        })
    }

    const horarioAtualizado = {}

    if (inicio !== undefined) horarioAtualizado.inicio = inicio
    if (fim !== undefined) horarioAtualizado.fim = fim
    if (intervalo !== undefined) horarioAtualizado.intervalo = intervalo
    if (trabalha !== undefined) horarioAtualizado.trabalha = trabalha

    const resultado = await horarioDAO.updateHorario(id, horarioAtualizado)

    if (resultado) {
        return response.status(200).json({
            status: true,
            message: 'Horário atualizado com sucesso.'
        })
    }

    return response.status(404).json({
        status: false,
        message: 'Horário não encontrado.'
    })
}

const listarHorariosDisponiveis = async function (request, response) {
    const data = request.query.data

    if (!data) {
        return response.status(400).json({
            status: false,
            message: 'Informe a data na query string. Exemplo: /horarios/disponiveis?data=2026-06-01'
        })
    }

    const dataSelecionada = new Date(data + 'T00:00:00')

    const diasSemana = [
        'domingo',
        'segunda',
        'terça',
        'quarta',
        'quinta',
        'sexta',
        'sábado'
    ]

    const diaSemana = diasSemana[dataSelecionada.getDay()]

    const horarios = await horarioDAO.selectHorarios()

    const horarioTrabalho = horarios.find(function (horario) {
        return horario.diaSemana === diaSemana
    })

    if (!horarioTrabalho || horarioTrabalho.trabalha === false) {
        return response.status(200).json({
            status: true,
            data,
            diaSemana,
            message: 'Não há atendimento neste dia.',
            horariosDisponiveis: []
        })
    }

    const bloqueios = await bloqueioDAO.selectBloqueios()
    const agendamentos = await agendamentoDAO.selectAgendamentos()

    const diaBloqueado = bloqueios.find(function (bloqueio) {
        return bloqueio.data === data && bloqueio.diaInteiro === true
    })

    if (diaBloqueado) {
        return response.status(200).json({
            status: true,
            data,
            diaSemana,
            message: 'Este dia está bloqueado.',
            horariosDisponiveis: []
        })
    }

    const horariosGerados = gerarHorarios(
        horarioTrabalho.inicio,
        horarioTrabalho.fim,
        horarioTrabalho.intervalo
    )

    const horariosDisponiveis = horariosGerados.filter(function (horario) {
        const bloqueado = bloqueios.find(function (bloqueio) {
            return bloqueio.data === data && bloqueio.horario === horario
        })

        const agendado = agendamentos.find(function (agendamento) {
            return agendamento.data === data && 
                   agendamento.horario === horario &&
                   agendamento.statusAgendamento !== 'cancelado'
        })

        return !bloqueado && !agendado
    })

    return response.status(200).json({
        status: true,
        data,
        diaSemana,
        horariosDisponiveis
    })
}

const gerarHorarios = function (inicio, fim, intervalo) {
    const horarios = []

    let [horaInicio, minutoInicio] = inicio.split(':').map(Number)
    let [horaFim, minutoFim] = fim.split(':').map(Number)

    let minutosAtuais = horaInicio * 60 + minutoInicio
    let minutosFim = horaFim * 60 + minutoFim

    while (minutosAtuais < minutosFim) {
        const hora = Math.floor(minutosAtuais / 60)
        const minuto = minutosAtuais % 60

        const horarioFormatado =
            String(hora).padStart(2, '0') +
            ':' +
            String(minuto).padStart(2, '0')

        horarios.push(horarioFormatado)

        minutosAtuais += intervalo
    }

    return horarios
}

module.exports = {
    listarHorarios,
    atualizarHorario,
    listarHorariosDisponiveis
}
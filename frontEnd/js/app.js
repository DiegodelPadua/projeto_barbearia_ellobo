const botaoAgendar = document.getElementById('btn-agendar')

const botoesVoltar = document.querySelectorAll('.btn-voltar')

const areaLogin = document.getElementById('area-login')
const formularioContainer = document.getElementById('formulario')

const formCadastro = document.getElementById('form-cadastro')
const formLogin = document.getElementById('form-login')
const formAgendamento = document.getElementById('form-agendamento')

const mostrarLogin = document.getElementById('mostrar-login')
const mostrarCadastro = document.getElementById('mostrar-cadastro')

const selectServico = document.getElementById('servico')
const inputData = document.getElementById('data')
const selectHorario = document.getElementById('horario')

const API_CLIENTES = 'http://localhost:8080/clientes'
const API_SERVICOS = 'http://localhost:8080/servicos'
const API_HORARIOS = 'http://localhost:8080/horarios'
const API_AGENDAMENTOS = 'http://localhost:8080/agendamentos'

let clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'))

botaoAgendar.addEventListener('click', function () {
    if (clienteLogado) {
        abrirAgendamento()
    } else {
        abrirLogin()
    }
})

function abrirLogin() {
    areaLogin.style.display = 'flex'
    formularioContainer.style.display = 'none'

    areaLogin.scrollIntoView({
        behavior: 'smooth'
    })
}

function abrirAgendamento() {
    areaLogin.style.display = 'none'
    formularioContainer.style.display = 'flex'

    carregarServicos()

    formularioContainer.scrollIntoView({
        behavior: 'smooth'
    })
}

mostrarLogin.addEventListener('click', function () {
    formCadastro.classList.add('escondido')
    formLogin.classList.remove('escondido')
})

mostrarCadastro.addEventListener('click', function () {
    formLogin.classList.add('escondido')
    formCadastro.classList.remove('escondido')
})

formCadastro.addEventListener('submit', async function (event) {
    event.preventDefault()

    const cliente = {
        nome: document.getElementById('cadastro-nome').value.trim(),
        email: document.getElementById('cadastro-email').value.trim(),
        senha: document.getElementById('cadastro-senha').value.trim()
    }

    if (!cliente.nome || !cliente.email || !cliente.senha) {
        alert('Preencha todos os campos.')
        return
    }

    try {
        const resposta = await fetch(`${API_CLIENTES}/cadastro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        })

        const dados = await resposta.json()

        if (resposta.ok) {
            clienteLogado = dados.cliente
            localStorage.setItem('clienteLogado', JSON.stringify(clienteLogado))

            alert('Conta criada com sucesso 💈')
            abrirAgendamento()
        } else {
            alert(dados.message)
        }

    } catch (error) {
        alert('Erro ao conectar com a API de clientes.')
        console.log(error)
    }
})

formLogin.addEventListener('submit', async function (event) {
    event.preventDefault()

    const login = {
        email: document.getElementById('login-email').value.trim(),
        senha: document.getElementById('login-senha').value.trim()
    }

    try {
        const resposta = await fetch(`${API_CLIENTES}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(login)
        })

        const dados = await resposta.json()

        if (resposta.ok) {
            clienteLogado = dados.cliente
            localStorage.setItem('clienteLogado', JSON.stringify(clienteLogado))

            alert(`Bem-vindo, ${clienteLogado.nome} 💈`)
            abrirAgendamento()
        } else {
            alert(dados.message)
        }

    } catch (error) {
        alert('Erro ao conectar com a API de login.')
        console.log(error)
    }
})

async function carregarServicos() {
    try {
        const resposta = await fetch(API_SERVICOS)
        const dados = await resposta.json()

        selectServico.innerHTML = '<option value="">Selecione um serviço</option>'

        dados.servicos.forEach(function (servico) {
            const option = document.createElement('option')

            option.value = servico.id
            option.textContent = `${servico.nome} - R$ ${servico.preco}`

            selectServico.appendChild(option)
        })

    } catch (error) {
        alert('Erro ao carregar serviços.')
        console.log(error)
    }
}

inputData.addEventListener('change', async function () {
    const dataSelecionada = inputData.value

    if (!dataSelecionada) {
        return
    }

    try {
        const resposta = await fetch(`${API_HORARIOS}/disponiveis?data=${dataSelecionada}`)
        const dados = await resposta.json()

        selectHorario.innerHTML = ''

        if (dados.horariosDisponiveis.length === 0) {
            selectHorario.innerHTML = '<option value="">Nenhum horário disponível</option>'
            return
        }

        selectHorario.innerHTML = '<option value="">Selecione um horário</option>'

        dados.horariosDisponiveis.forEach(function (horario) {
            const option = document.createElement('option')

            option.value = horario
            option.textContent = horario

            selectHorario.appendChild(option)
        })

    } catch (error) {
        alert('Erro ao carregar horários disponíveis.')
        console.log(error)
    }
})

formAgendamento.addEventListener('submit', async function (event) {
    event.preventDefault()

    if (!clienteLogado) {
        alert('Você precisa estar logado para agendar.')
        abrirLogin()
        return
    }

    const agendamento = {
        idCliente: clienteLogado.id,
        idServico: Number(selectServico.value),
        data: inputData.value,
        horario: selectHorario.value
    }

    if (!agendamento.idServico || !agendamento.data || !agendamento.horario) {
        alert('Preencha serviço, data e horário.')
        return
    }

    try {
        const resposta = await fetch(API_AGENDAMENTOS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(agendamento)
        })

        const dados = await resposta.json()

        if (resposta.ok) {
            alert('Agendamento confirmado com sucesso 💈')
            formAgendamento.reset()
            selectHorario.innerHTML = '<option value="">Escolha uma data primeiro</option>'
        } else {
            alert(dados.message)
        }

    } catch (error) {
        alert('Erro ao confirmar agendamento.')
        console.log(error)
    }
})
botoesVoltar.forEach(function(botao){

    botao.addEventListener('click', function(){

        areaLogin.style.display = 'none'

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })

    })

})
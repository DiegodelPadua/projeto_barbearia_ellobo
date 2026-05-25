const botaoAgendar = document.getElementById('btn-agendar')

const areaLogin = document.getElementById('area-login')
const formularioContainer = document.getElementById('formulario')

const formCadastro = document.getElementById('form-cadastro')
const formLogin = document.getElementById('form-login')

const mostrarLogin = document.getElementById('mostrar-login')
const mostrarCadastro = document.getElementById('mostrar-cadastro')

const API_CLIENTES = 'http://localhost:8080/clientes'

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
})

formLogin.addEventListener('submit', async function (event) {
    event.preventDefault()

    const login = {
        email: document.getElementById('login-email').value.trim(),
        senha: document.getElementById('login-senha').value.trim()
    }

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
})
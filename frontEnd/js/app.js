const botaoAgendar = document.getElementById('btn-agendar')

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

const linkAdmin = document.getElementById('link-admin')
const areaUsuarioLogado = document.getElementById('usuario-logado')
const nomeUsuario = document.getElementById('nome-usuario')
const btnSairCliente = document.getElementById('btn-sair-cliente')

const areaMeusAgendamentos = document.getElementById('meus-agendamentos')
const listaMeusAgendamentos = document.getElementById('lista-meus-agendamentos')

const areaReagendar = document.getElementById('area-reagendar')
const formReagendar = document.getElementById('form-reagendar')
const inputIdAgendamentoReagendar = document.getElementById('id-agendamento-reagendar')
const inputNovaData = document.getElementById('nova-data')
const selectNovoHorario = document.getElementById('novo-horario')
const btnCancelarReagendamento = document.getElementById('btn-cancelar-reagendamento')


const API_CLIENTES = 'http://localhost:8080/clientes'
const API_SERVICOS = 'http://localhost:8080/servicos'
const API_HORARIOS = 'http://localhost:8080/horarios'
const API_AGENDAMENTOS = 'http://localhost:8080/agendamentos'

let clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'))

verificarClienteLogado()

botaoAgendar.addEventListener('click', function () {
    if (clienteLogado) {
        abrirAgendamento()
    } else {
        abrirLogin()
    }
})

function verificarClienteLogado() {
    if (clienteLogado) {
        nomeUsuario.textContent = `Olá, ${clienteLogado.nome}`
        areaUsuarioLogado.classList.remove('escondido')
        linkAdmin.classList.add('escondido')
        abrirAgendamento()
    } else {
        areaUsuarioLogado.classList.add('escondido')
        linkAdmin.classList.remove('escondido')
    }
}

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
    areaMeusAgendamentos.style.display = 'block'

    carregarServicos()
    carregarMeusAgendamentos()

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

   const senha = document.getElementById('cadastro-senha').value.trim()
   const confirmarSenha = document.getElementById('cadastro-confirmar-senha').value.trim()

    if(senha !== confirmarSenha){
        alert('As senhas não conferem.')
        return
    }

    const cliente = {
        nome: document.getElementById('cadastro-nome').value.trim(),
        email: document.getElementById('cadastro-email').value.trim(),
        telefone: document.getElementById('cadastro-telefone').value.trim(),
        senha: senha
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
        verificarClienteLogado()
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
        verificarClienteLogado()
    } else {
        alert(dados.message)
    }
})

async function carregarServicos() {
    const resposta = await fetch(API_SERVICOS)
    const dados = await resposta.json()

    selectServico.innerHTML = '<option value="">Selecione um serviço</option>'

    dados.servicos.forEach(function (servico) {
        const option = document.createElement('option')

        option.value = servico.id
        option.textContent = `${servico.nome} - R$ ${servico.preco}`

        selectServico.appendChild(option)
    })
}

inputData.addEventListener('change', async function () {
    const dataSelecionada = inputData.value

    if (!dataSelecionada) {
        return
    }

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
})

formAgendamento.addEventListener('submit', async function (event) {
    event.preventDefault()

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
    
        carregarMeusAgendamentos()
    
    } else {
        alert(dados.message)
    }
})

async function carregarMeusAgendamentos(){
    try {
        const resposta = await fetch(API_AGENDAMENTOS)
        const dados = await resposta.json()

        listaMeusAgendamentos.innerHTML = ''

        const meusAgendamentos = dados.agendamentos.filter(function(agendamento){
            return agendamento.cliente && agendamento.cliente.id == clienteLogado.id
        })

        if(meusAgendamentos.length === 0){
            listaMeusAgendamentos.innerHTML = '<p>Você ainda não possui agendamentos.</p>'
            return
        }

        meusAgendamentos.forEach(function(agendamento){

            const item = document.createElement('div')
            item.classList.add('item-meu-agendamento')

            const nomeServico = agendamento.servico?.nome || 'Serviço não informado'
            const dataAgendamento = agendamento.data || 'Data não informada'
            const horarioAgendamento = agendamento.horario || 'Horário não informado'
            const statusAgendamento = agendamento.statusAgendamento || 'sem status'

            item.innerHTML = `
            <div>
                <strong>${nomeServico}</strong>
        
                <p>Data: ${dataAgendamento}</p>
        
                <p>Horário: ${horarioAgendamento}</p>
            </div>
        
            <div>
        
                <span class="status-agendamento">
                    ${agendamento.statusAgendamento}
                </span>
        
                ${
                    agendamento.statusAgendamento !== 'cancelado'
                    ? `
                        <button onclick="cancelarMeuAgendamento(${agendamento.id})">
                            Cancelar
                        </button>
        
                        <button onclick="abrirReagendamento(${agendamento.id})">
                            Reagendar
                        </button>
                    `
                    : ''
                }
        
            </div>
        `

            listaMeusAgendamentos.appendChild(item)
        })

    } catch(error){
        console.log(error)
        alert('Erro ao carregar seus agendamentos.')
    }
}

btnSairCliente.addEventListener('click', function () {
    localStorage.removeItem('clienteLogado')
    clienteLogado = null
    location.reload()
})
window.cancelarMeuAgendamento = async function(id){
    const confirmar = confirm('Tem certeza que deseja cancelar este agendamento?')

    if(!confirmar){
        return
    }

    try {
        const resposta = await fetch(`${API_AGENDAMENTOS}/${id}/cancelar`, {
            method: 'PUT'
        })

        const dados = await resposta.json()

        if(resposta.ok){
            alert('Agendamento cancelado com sucesso.')
            carregarMeusAgendamentos()

            if(inputData.value){
                inputData.dispatchEvent(new Event('change'))
            }

        }else{
            alert(dados.message)
        }

    } catch(error){
        alert('Erro ao cancelar agendamento.')
        console.log(error)
    }
}
window.abrirReagendamento = function(id){
    inputIdAgendamentoReagendar.value = id

    areaReagendar.style.display = 'flex'

    areaReagendar.scrollIntoView({
        behavior: 'smooth'
    })
}

btnCancelarReagendamento.addEventListener('click', function(){
    areaReagendar.style.display = 'none'
    formReagendar.reset()
    selectNovoHorario.innerHTML = '<option value="">Escolha uma nova data primeiro</option>'
})

inputNovaData.addEventListener('change', async function(){
    const dataSelecionada = inputNovaData.value

    if(!dataSelecionada){
        return
    }

    const resposta = await fetch(`${API_HORARIOS}/disponiveis?data=${dataSelecionada}`)
    const dados = await resposta.json()

    selectNovoHorario.innerHTML = ''

    if(dados.horariosDisponiveis.length === 0){
        selectNovoHorario.innerHTML = '<option value="">Nenhum horário disponível</option>'
        return
    }

    selectNovoHorario.innerHTML = '<option value="">Selecione um horário</option>'

    dados.horariosDisponiveis.forEach(function(horario){
        const option = document.createElement('option')

        option.value = horario
        option.textContent = horario

        selectNovoHorario.appendChild(option)
    })
})

formReagendar.addEventListener('submit', async function(event){
    event.preventDefault()

    const idAgendamento = inputIdAgendamentoReagendar.value

    const dadosReagendamento = {
        data: inputNovaData.value,
        horario: selectNovoHorario.value
    }

    if(!idAgendamento){
        alert('Agendamento não encontrado para reagendar.')
        return
    }

    if(!dadosReagendamento.data || !dadosReagendamento.horario){
        alert('Escolha a nova data e o novo horário.')
        return
    }

    try{
        const resposta = await fetch(`${API_AGENDAMENTOS}/${idAgendamento}/reagendar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosReagendamento)
        })

        const dados = await resposta.json()

        if(resposta.ok){
            alert('Agendamento reagendado com sucesso.')

            areaReagendar.style.display = 'none'
            formReagendar.reset()

            selectNovoHorario.innerHTML = `
                <option value="">
                    Escolha uma nova data primeiro
                </option>
            `

            await carregarMeusAgendamentos()

            if(inputData.value){
                inputData.dispatchEvent(new Event('change'))
            }

        }else{
            alert(dados.message)
        }

    }catch(error){
        alert('Erro ao confirmar reagendamento.')
        console.log(error)
    }
})
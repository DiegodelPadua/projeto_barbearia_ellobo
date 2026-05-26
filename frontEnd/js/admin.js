document.addEventListener('DOMContentLoaded', function(){

    const formLoginAdmin = document.getElementById('form-login-admin')
    const areaLoginAdmin = document.getElementById('area-login-admin')
    const painelAdmin = document.getElementById('painel-admin')
    const btnSair = document.getElementById('btn-sair')

    const btnGerenciarServicos = document.getElementById('btn-gerenciar-servicos')
    const secaoServicos = document.getElementById('secao-servicos')
    const formServico = document.getElementById('form-servico')
    const listaServicos = document.getElementById('lista-servicos')

    const btnGerenciarHorarios = document.getElementById('btn-gerenciar-horarios')
    const secaoHorarios = document.getElementById('secao-horarios')
    const listaHorarios = document.getElementById('lista-horarios')

    const btnGerenciarBloqueios = document.getElementById('btn-gerenciar-bloqueios')
    const secaoBloqueios = document.getElementById('secao-bloqueios')
    const formBloqueio = document.getElementById('form-bloqueio')
    const listaBloqueios = document.getElementById('lista-bloqueios')
    const selectDiaInteiro = document.getElementById('bloqueio-dia-inteiro')
    const inputHorarioBloqueio = document.getElementById('bloqueio-horario')

    const btnVerAgendamentos = document.getElementById('btn-ver-agendamentos')
    const secaoAgendamentos = document.getElementById('secao-agendamentos')
    const listaAgendamentos = document.getElementById('lista-agendamentos')

    const btnBuscarAgendamentos = document.getElementById('btn-buscar-agendamentos')
    const inputDataAgendamentoAdmin = document.getElementById('data-agendamento-admin')
    const tabelaAgendamentos = document.getElementById('tabela-agendamentos')

    const API_COLABORADORES = 'http://localhost:8080/colaboradores'
    const API_SERVICOS = 'http://localhost:8080/servicos'
    const API_HORARIOS = 'http://localhost:8080/horarios'
    const API_BLOQUEIOS = 'http://localhost:8080/bloqueios'
    const API_AGENDAMENTOS = 'http://localhost:8080/agendamentos'
    

    let colaboradorLogado = JSON.parse(localStorage.getItem('colaboradorLogado'))

    if (colaboradorLogado) {
        abrirPainel()
    }

    formLoginAdmin.addEventListener('submit', async function(event){
        event.preventDefault()

        const login = {
            email: document.getElementById('admin-email').value.trim(),
            senha: document.getElementById('admin-senha').value.trim()
        }

        try {
            const resposta = await fetch(`${API_COLABORADORES}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(login)
            })

            const dados = await resposta.json()

            if (resposta.ok) {
                localStorage.setItem('colaboradorLogado', JSON.stringify(dados.colaborador))
                alert(`Bem-vindo, ${dados.colaborador.nome}`)
                abrirPainel()
            } else {
                alert(dados.message)
            }

        } catch (error) {
            alert('Erro ao conectar com a API de colaboradores.')
            console.log(error)
        }
    })

    btnSair.addEventListener('click', function(){
        localStorage.removeItem('colaboradorLogado')
        location.reload()
    })

    function abrirPainel(){
        areaLoginAdmin.classList.add('escondido')
        painelAdmin.classList.remove('escondido')
    }

    btnGerenciarServicos.addEventListener('click', function(){
        secaoServicos.classList.toggle('escondido')
        carregarServicosAdmin()
    })

    async function carregarServicosAdmin(){
        try {
            const resposta = await fetch(API_SERVICOS)
            const dados = await resposta.json()

            listaServicos.innerHTML = ''

            dados.servicos.forEach(function(servico){

                const item = document.createElement('div')
                item.classList.add('item-servico')

                item.innerHTML = `
                    <div>
                        <strong>${servico.nome}</strong>
                        <span>Preço: R$ ${servico.preco}</span>
                        <span>Duração: ${servico.duracao} minutos</span>
                    </div>

                    <div class="acoes-servico">
                        <button class="btn-editar" onclick="editarServico(${servico.id})">
                            Editar
                        </button>

                        <button class="btn-deletar" onclick="deletarServico(${servico.id})">
                            Excluir
                        </button>
                    </div>
                `

                listaServicos.appendChild(item)
            })

        } catch (error) {
            alert('Erro ao carregar serviços.')
            console.log(error)
        }
    }

    formServico.addEventListener('submit', async function(event){
        event.preventDefault()

        const novoServico = {
            nome: document.getElementById('servico-nome').value.trim(),
            preco: Number(document.getElementById('servico-preco').value),
            duracao: Number(document.getElementById('servico-duracao').value)
        }

        if (!novoServico.nome || !novoServico.preco || !novoServico.duracao) {
            alert('Preencha todos os campos do serviço.')
            return
        }

        try {
            const resposta = await fetch(API_SERVICOS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoServico)
            })

            const dados = await resposta.json()

            if (resposta.ok) {
                alert('Serviço cadastrado com sucesso.')
                formServico.reset()
                carregarServicosAdmin()
            } else {
                alert(dados.message)
            }

        } catch (error) {
            alert('Erro ao cadastrar serviço.')
            console.log(error)
        }
    })

    window.deletarServico = async function(id){
        const confirmar = confirm('Tem certeza que deseja excluir este serviço?')

        if (!confirmar) {
            return
        }

        try {
            const resposta = await fetch(`${API_SERVICOS}/${id}`, {
                method: 'DELETE'
            })

            const dados = await resposta.json()

            if (resposta.ok) {
                alert('Serviço excluído com sucesso.')
                carregarServicosAdmin()
            } else {
                alert(dados.message)
            }

        } catch (error) {
            alert('Erro ao excluir serviço.')
            console.log(error)
        }
    }

    window.editarServico = async function(id){
        const novoNome = prompt('Digite o novo nome do serviço:')
        const novoPreco = prompt('Digite o novo preço:')
        const novaDuracao = prompt('Digite a nova duração em minutos:')

        const servicoAtualizado = {}

        if (novoNome) servicoAtualizado.nome = novoNome
        if (novoPreco) servicoAtualizado.preco = Number(novoPreco)
        if (novaDuracao) servicoAtualizado.duracao = Number(novaDuracao)

        if (
            !servicoAtualizado.nome &&
            !servicoAtualizado.preco &&
            !servicoAtualizado.duracao
        ) {
            alert('Nenhum dado foi alterado.')
            return
        }

        try {
            const resposta = await fetch(`${API_SERVICOS}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(servicoAtualizado)
            })

            const dados = await resposta.json()

            if (resposta.ok) {
                alert('Serviço atualizado com sucesso.')
                carregarServicosAdmin()
            } else {
                alert(dados.message)
            }

        } catch (error) {
            alert('Erro ao editar serviço.')
            console.log(error)
        }
    }

    btnGerenciarHorarios.addEventListener('click', function(){
        secaoHorarios.classList.toggle('escondido')
        carregarHorariosAdmin()
    })

    async function carregarHorariosAdmin(){
        try {
            const resposta = await fetch(API_HORARIOS)
            const dados = await resposta.json()

            listaHorarios.innerHTML = ''

            dados.horarios.forEach(function(horario){

                const item = document.createElement('div')
                item.classList.add('item-horario')

                item.innerHTML = `
                    <strong>${horario.diaSemana}</strong>

                    <input 
                        type="time"
                        id="inicio-${horario.id}"
                        value="${horario.inicio || ''}"
                        ${!horario.trabalha ? 'disabled' : ''}
                    >

                    <input 
                        type="time"
                        id="fim-${horario.id}"
                        value="${horario.fim || ''}"
                        ${!horario.trabalha ? 'disabled' : ''}
                    >

                    <select id="intervalo-${horario.id}">
                        <option value="15" ${horario.intervalo == 15 ? 'selected' : ''}>15 min</option>
                        <option value="30" ${horario.intervalo == 30 ? 'selected' : ''}>30 min</option>
                        <option value="45" ${horario.intervalo == 45 ? 'selected' : ''}>45 min</option>
                        <option value="60" ${horario.intervalo == 60 ? 'selected' : ''}>60 min</option>
                    </select>

                    <select 
                        id="trabalha-${horario.id}"
                        onchange="toggleHorario(${horario.id})"
                    >
                        <option value="true" ${horario.trabalha ? 'selected' : ''}>
                            Trabalha
                        </option>

                        <option value="false" ${!horario.trabalha ? 'selected' : ''}>
                            Não trabalha
                        </option>
                    </select>

                    <button onclick="salvarHorario(${horario.id})">
                        Salvar
                    </button>
                `

                listaHorarios.appendChild(item)
            })

        } catch (error) {
            alert('Erro ao carregar horários.')
            console.log(error)
        }
    }

    window.toggleHorario = function(id){
        const trabalha = document.getElementById(`trabalha-${id}`).value === 'true'

        const inputInicio = document.getElementById(`inicio-${id}`)
        const inputFim = document.getElementById(`fim-${id}`)

        inputInicio.disabled = !trabalha
        inputFim.disabled = !trabalha

        if (!trabalha) {
            inputInicio.value = ''
            inputFim.value = ''
        }
    }

    window.salvarHorario = async function(id){
        const trabalha = document.getElementById(`trabalha-${id}`).value === 'true'

        const horarioAtualizado = {
            inicio: trabalha ? document.getElementById(`inicio-${id}`).value : null,
            fim: trabalha ? document.getElementById(`fim-${id}`).value : null,
            intervalo: Number(document.getElementById(`intervalo-${id}`).value),
            trabalha
        }

        try {
            const resposta = await fetch(`${API_HORARIOS}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(horarioAtualizado)
            })

            const dados = await resposta.json()

            if (resposta.ok) {
                alert('Horário atualizado com sucesso.')
                carregarHorariosAdmin()
            } else {
                alert(dados.message)
            }

        } catch (error) {
            alert('Erro ao salvar horário.')
            console.log(error)
        }
    }

    btnGerenciarBloqueios.addEventListener('click', function(){
        secaoBloqueios.classList.toggle('escondido')
        carregarBloqueiosAdmin()
    })
    
    selectDiaInteiro.addEventListener('change', function(){
        const diaInteiro = selectDiaInteiro.value === 'true'
    
        inputHorarioBloqueio.disabled = diaInteiro
    
        if (diaInteiro) {
            inputHorarioBloqueio.value = ''
        }
    })
    
    formBloqueio.addEventListener('submit', async function(event){
        event.preventDefault()
    
        const diaInteiro = selectDiaInteiro.value === 'true'
    
        const novoBloqueio = {
            data: document.getElementById('bloqueio-data').value,
            horario: diaInteiro ? null : inputHorarioBloqueio.value,
            diaInteiro,
            motivo: document.getElementById('bloqueio-motivo').value.trim()
        }
    
        if (!novoBloqueio.data) {
            alert('Informe a data do bloqueio.')
            return
        }
    
        if (!diaInteiro && !novoBloqueio.horario) {
            alert('Informe o horário ou selecione dia inteiro.')
            return
        }
    
        try {
            const resposta = await fetch(API_BLOQUEIOS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoBloqueio)
            })
    
            const dados = await resposta.json()
    
            if (resposta.ok) {
                alert('Bloqueio cadastrado com sucesso.')
                formBloqueio.reset()
                inputHorarioBloqueio.disabled = false
                carregarBloqueiosAdmin()
            } else {
                alert(dados.message)
            }
    
        } catch (error) {
            alert('Erro ao cadastrar bloqueio.')
            console.log(error)
        }
    })
    
    async function carregarBloqueiosAdmin(){
        try {
            const resposta = await fetch(API_BLOQUEIOS)
            const dados = await resposta.json()
    
            listaBloqueios.innerHTML = ''
    
            if (dados.bloqueios.length === 0) {
                listaBloqueios.innerHTML = '<p class="descricao-secao">Nenhum bloqueio cadastrado.</p>'
                return
            }
    
            dados.bloqueios.forEach(function(bloqueio){
    
                const item = document.createElement('div')
                item.classList.add('item-bloqueio')
    
                item.innerHTML = `
                    <div>
                        <strong>${bloqueio.diaInteiro ? 'Dia inteiro bloqueado' : 'Horário bloqueado'}</strong>
                        <span>Data: ${bloqueio.data}</span>
                        <span>Horário: ${bloqueio.horario || 'Dia inteiro'}</span>
                        <span>Motivo: ${bloqueio.motivo}</span>
                    </div>
    
                    <button class="btn-deletar" onclick="deletarBloqueio(${bloqueio.id})">
                        Excluir
                    </button>
                `
    
                listaBloqueios.appendChild(item)
            })
    
        } catch (error) {
            alert('Erro ao carregar bloqueios.')
            console.log(error)
        }
    }
    
    window.deletarBloqueio = async function(id){
        const confirmar = confirm('Tem certeza que deseja excluir este bloqueio?')
    
        if (!confirmar) {
            return
        }
    
        try {
            const resposta = await fetch(`${API_BLOQUEIOS}/${id}`, {
                method: 'DELETE'
            })
    
            const dados = await resposta.json()
    
            if (resposta.ok) {
                alert('Bloqueio excluído com sucesso.')
                carregarBloqueiosAdmin()
            } else {
                alert(dados.message)
            }
    
        } catch (error) {
            alert('Erro ao excluir bloqueio.')
            console.log(error)
        }
    }
    btnVerAgendamentos.addEventListener('click', function(){
        secaoAgendamentos.classList.toggle('escondido')
    })
    
    btnBuscarAgendamentos.addEventListener('click', async function(){
        const data = inputDataAgendamentoAdmin.value
    
        if (!data) {
            alert('Escolha uma data para consultar.')
            return
        }
    
        await carregarTabelaAgendamentos(data)
    })
    
    async function carregarTabelaAgendamentos(data){
        try {
            const respostaHorarios = await fetch(`${API_HORARIOS}/disponiveis?data=${data}`)
            const dadosHorarios = await respostaHorarios.json()
    
            const respostaAgendamentos = await fetch(API_AGENDAMENTOS)
            const dadosAgendamentos = await respostaAgendamentos.json()
    
            const agendamentosDoDia = dadosAgendamentos.agendamentos.filter(function(agendamento){
                return agendamento.data === data
            })
    
            const horariosDisponiveis = dadosHorarios.horariosDisponiveis
    
            const horariosOcupados = agendamentosDoDia.map(function(agendamento){
                return agendamento.horario
            })
    
            const todosHorarios = [
                ...horariosDisponiveis,
                ...horariosOcupados
            ].sort()
    
            tabelaAgendamentos.innerHTML = ''
    
            if (todosHorarios.length === 0) {
                tabelaAgendamentos.innerHTML = '<p class="descricao-secao">Nenhum horário encontrado para esta data.</p>'
                return
            }
    
            todosHorarios.forEach(function(horario){
    
                const agendamentoEncontrado = agendamentosDoDia.find(function(agendamento){
                    return agendamento.horario === horario
                })
    
                const linha = document.createElement('div')
                linha.classList.add('linha-agendamento')
    
                if (agendamentoEncontrado) {
                    linha.innerHTML = `
                        <strong>${horario}</strong>
    
                        <span class="status-ocupado">
                            Ocupado
                        </span>
    
                        <span>
                            Cliente: ${agendamentoEncontrado.cliente.nome}
                        </span>
    
                        <span>
                            Serviço: ${agendamentoEncontrado.servico.nome}
                        </span>
                    `
                } else {
                    linha.innerHTML = `
                        <strong>${horario}</strong>
    
                        <span class="status-livre">
                            Disponível
                        </span>
    
                        <span>
                            Cliente: -
                        </span>
    
                        <span>
                            Serviço: -
                        </span>
                    `
                }
    
                tabelaAgendamentos.appendChild(linha)
            })
    
        } catch (error) {
            alert('Erro ao carregar tabela de horários.')
            console.log(error)
        }
    }
})

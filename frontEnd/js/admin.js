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
    const inputHorarioBloqueioInicio = document.getElementById('bloqueio-horario-inicio')
    const inputHorarioBloqueioFim = document.getElementById('bloqueio-horario-fim')

    const btnClientes = document.getElementById('btn-clientes')
    const secaoClientes = document.getElementById('secao-clientes')
    const listaClientes = document.getElementById('lista-clientes')

    const btnVerAgendamentos = document.getElementById('btn-ver-agendamentos')
    const secaoAgendamentos = document.getElementById('secao-agendamentos')
    const listaAgendamentos = document.getElementById('lista-agendamentos')

    const faturamentoSemana = document.getElementById('faturamento-semana')
    const faturamentoMes = document.getElementById('faturamento-mes')
    const totalConfirmados = document.getElementById('total-confirmados')
    const servicoMaisVendido = document.getElementById('servico-mais-vendido')
    const clienteMaisFrequente = document.getElementById('cliente-mais-frequente')
    
    const btnBuscarAgendamentos = document.getElementById('btn-buscar-agendamentos')
    const inputDataAgendamentoAdmin = document.getElementById('data-agendamento-admin')
    const tabelaAgendamentos = document.getElementById('tabela-agendamentos')

    const totalAgendamentosHoje = document.getElementById('total-agendamentos-hoje')
    const totalClientes = document.getElementById('total-clientes')
    const faturamentoHoje = document.getElementById('faturamento-hoje')
    const proximoAtendimento = document.getElementById('proximo-atendimento')

    const btnAgendaMes = document.getElementById('btn-agenda-mes')
    const secaoAgendaMes = document.getElementById('secao-agenda-mes')
    const calendarioAdmin = document.getElementById('calendario-admin')

    const API_COLABORADORES = 'http://localhost:8080/colaboradores'
    const API_SERVICOS = 'http://localhost:8080/servicos'
    const API_HORARIOS = 'http://localhost:8080/horarios'
    const API_BLOQUEIOS = 'http://localhost:8080/bloqueios'
    const API_AGENDAMENTOS = 'http://localhost:8080/agendamentos'
    const API_CLIENTES = 'http://localhost:8080/clientes'


    let colaboradorLogado = JSON.parse(localStorage.getItem('colaboradorLogado'))
    let tokenAdmin = localStorage.getItem('tokenAdmin')
    

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
                 colaboradorLogado = dados.colaborador
                 tokenAdmin = dados.token
                localStorage.setItem('colaboradorLogado', JSON.stringify(dados.colaborador))
                localStorage.setItem('tokenAdmin', dados.token)
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
        localStorage.removeItem('tokenAdmin')
        location.reload()
    })

    function abrirPainel(){
        areaLoginAdmin.classList.add('escondido')
        painelAdmin.classList.remove('escondido')
    
        carregarDashboard()
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
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
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${tokenAdmin}`
            }
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
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
    
        inputHorarioBloqueioInicio.disabled = diaInteiro
        inputHorarioBloqueioFim.disabled = diaInteiro

        if (diaInteiro) {
            inputHorarioBloqueioInicio.value = ''
            inputHorarioBloqueioFim.value = ''
        }
    })
    
    formBloqueio.addEventListener('submit', async function(event){
        event.preventDefault()
    
        const diaInteiro = selectDiaInteiro.value === 'true'
    
        const novoBloqueio = {
            data: document.getElementById('bloqueio-data').value,
            horarioInicio: diaInteiro ? null : inputHorarioBloqueioInicio.value,
            horarioFim: diaInteiro ? null : inputHorarioBloqueioFim.value,
            diaInteiro,
            motivo: document.getElementById('bloqueio-motivo').value.trim()
        }
    
        if (!novoBloqueio.data) {
            alert('Informe a data do bloqueio.')
            return
        }
    
        if (!diaInteiro && (!novoBloqueio.horarioInicio || !novoBloqueio.horarioFim)) {
            alert('Informe o horário inicial e o horário final do bloqueio.')
            return
        }

        if (!diaInteiro && novoBloqueio.horarioInicio >= novoBloqueio.horarioFim) {
            alert('O horário inicial deve ser menor que o horário final.')
            return
        }
    
        try {
           const resposta = await fetch(API_BLOQUEIOS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
            },
            body: JSON.stringify(novoBloqueio)
        })
    
            const dados = await resposta.json()
    
            if (resposta.ok) {
                alert('Bloqueio cadastrado com sucesso.')

                formBloqueio.reset()

                inputHorarioBloqueioInicio.disabled = false
                inputHorarioBloqueioFim.disabled = false

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
                        <span>
                        Horário: ${
                            bloqueio.diaInteiro 
                            ? 'Dia inteiro' 
                            : `${bloqueio.horarioInicio} até ${bloqueio.horarioFim}`
                        }
                    </span>
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
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${tokenAdmin}`
            }
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

    btnClientes.addEventListener('click', function(){

        secaoClientes.classList.toggle('escondido')

        carregarClientes()

    })
    
    btnBuscarAgendamentos.addEventListener('click', async function(){
        const data = inputDataAgendamentoAdmin.value
    
        if (!data) {
            alert('Escolha uma data para consultar.')
            return
        }
    
        await carregarTabelaAgendamentos(data)
    })

    btnAgendaMes.addEventListener('click', function(){

        secaoAgendaMes.classList.toggle('escondido')

        carregarAgendaMes()

    })
    
    async function carregarTabelaAgendamentos(data){
        try {
            const respostaHorarios = await fetch(`${API_HORARIOS}/disponiveis?data=${data}`)
            const dadosHorarios = await respostaHorarios.json()
    
            const respostaAgendamentos = await fetch(API_AGENDAMENTOS)
            const dadosAgendamentos = await respostaAgendamentos.json()
    
            const agendamentosDoDia = dadosAgendamentos.agendamentos.filter(function(agendamento){
                return agendamento.data === data &&
                       agendamento.statusAgendamento === 'confirmado'
            })
    
            const horariosDisponiveis = dadosHorarios.horariosDisponiveis
    
            const horariosOcupados = [...new Set(agendamentosDoDia.map(function(agendamento){
                return agendamento.horario
            }))]
    
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
                
                        <button 
                            class="btn-deletar"
                            onclick="cancelarAgendamentoAdmin(${agendamentoEncontrado.id})"
                        >
                            Remover
                        </button>
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
                
                        <span>-</span>
                    `
                }
                tabelaAgendamentos.appendChild(linha)
            })
    
        } catch (error) {
            alert('Erro ao carregar tabela de horários.')
            console.log(error)
        }
    }

    async function carregarDashboard(){
        try {
            const respostaAgendamentos = await fetch(API_AGENDAMENTOS)
            const dadosAgendamentos = await respostaAgendamentos.json()

            const respostaClientes = await fetch(API_CLIENTES, {
                headers: {
                    'Authorization': `Bearer ${tokenAdmin}`
                }
            })
            const dadosClientes = await respostaClientes.json()

            const hoje = new Date()
            const hojeFormatado = hoje.toLocaleDateString('sv-SE')

            const inicioSemana = new Date(hoje)
            inicioSemana.setDate(hoje.getDate() - hoje.getDay())

            const anoAtual = hoje.getFullYear()
            const mesAtual = hoje.getMonth()

            const agendamentosConfirmados = dadosAgendamentos.agendamentos.filter(function(agendamento){
                return agendamento.statusAgendamento === 'confirmado'
            })

            const agendamentosHoje = agendamentosConfirmados.filter(function(agendamento){
                return agendamento.data === hojeFormatado
            })

            const agendamentosSemana = agendamentosConfirmados.filter(function(agendamento){
                const dataAgendamento = new Date(agendamento.data + 'T00:00:00')
                return dataAgendamento >= inicioSemana && dataAgendamento <= hoje
            })

            const agendamentosMes = agendamentosConfirmados.filter(function(agendamento){
                const dataAgendamento = new Date(agendamento.data + 'T00:00:00')
                return dataAgendamento.getFullYear() === anoAtual &&
                    dataAgendamento.getMonth() === mesAtual
            })

            totalAgendamentosHoje.textContent = agendamentosHoje.length
            totalClientes.textContent = dadosClientes.clientes.length
            totalConfirmados.textContent = agendamentosConfirmados.length

            const totalHoje = calcularFaturamento(agendamentosHoje)
            const totalSemana = calcularFaturamento(agendamentosSemana)
            const totalMes = calcularFaturamento(agendamentosMes)

            faturamentoHoje.textContent = formatarMoeda(totalHoje)
            faturamentoSemana.textContent = formatarMoeda(totalSemana)
            faturamentoMes.textContent = formatarMoeda(totalMes)

            servicoMaisVendido.textContent = encontrarMaisFrequente(
                agendamentosConfirmados,
                function(agendamento){
                    return agendamento.servico?.nome
                }
            )

            clienteMaisFrequente.textContent = encontrarMaisFrequente(
                agendamentosConfirmados,
                function(agendamento){
                    return agendamento.cliente?.nome
                }
            )

            const agora = new Date()

            const proximos = agendamentosHoje.filter(function(agendamento){
                const dataHora = new Date(`${agendamento.data}T${agendamento.horario}:00`)
                return dataHora >= agora
            })

            proximos.sort(function(a, b){
                return a.horario.localeCompare(b.horario)
            })

            if(proximos.length > 0){
                proximoAtendimento.textContent = `${proximos[0].horario} - ${proximos[0].cliente.nome}`
            }else{
                proximoAtendimento.textContent = '-'
            }

        } catch(error) {
            console.log(error)
            alert('Erro ao carregar dashboard financeiro.')
        }
    }

    window.cancelarAgendamentoAdmin = async function(id){
        const confirmar = confirm('Tem certeza que deseja remover este agendamento definitivamente?')

        if(!confirmar){
            return
        }

        try {
            const resposta = await fetch(`${API_AGENDAMENTOS}/${id}/remover-admin`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${tokenAdmin}`
                }
            })

            const dados = await resposta.json()

            if(resposta.ok){
                alert('Agendamento removido definitivamente.')

                if(inputDataAgendamentoAdmin.value){
                    carregarTabelaAgendamentos(inputDataAgendamentoAdmin.value)
                }

                carregarDashboard()

            }else{
                alert(dados.message)
            }

        } catch(error){
            alert('Erro ao remover agendamento.')
            console.log(error)
        }
    }

   async function carregarClientes(){

    try{

        const respostaClientes = await fetch(API_CLIENTES, {
        headers: {
            'Authorization': `Bearer ${tokenAdmin}`
        }
    })
        const dadosClientes = await respostaClientes.json()

        const respostaAgendamentos = await fetch(API_AGENDAMENTOS)
        const dadosAgendamentos = await respostaAgendamentos.json()

        listaClientes.innerHTML = ''

        dadosClientes.clientes.forEach(function(cliente){

            const agendamentosCliente = dadosAgendamentos.agendamentos.filter(function(agendamento){
                return agendamento.cliente &&
                       agendamento.cliente.id == cliente.id
            })

            const agendamentosConfirmados = agendamentosCliente.filter(function(agendamento){
                return agendamento.statusAgendamento === 'confirmado'
            })

            const agendamentosCancelados = agendamentosCliente.filter(function(agendamento){
                return agendamento.statusAgendamento === 'cancelado'
            })

            const totalGasto = agendamentosConfirmados.reduce(function(total, agendamento){
                return total + Number(agendamento.servico?.preco || 0)
            }, 0)

            const ultimaVisita = agendamentosConfirmados.length > 0
                ? agendamentosConfirmados[agendamentosConfirmados.length - 1].data
                : 'Nenhuma'

            const servicosRealizados = agendamentosConfirmados.map(function(agendamento){
                return agendamento.servico?.nome || 'Serviço não informado'
            })

            const listaServicos = servicosRealizados.length > 0
                ? servicosRealizados.map(function(servico){
                    return `<li>${servico}</li>`
                }).join('')
                : '<li>Nenhum serviço confirmado</li>'

            const card = document.createElement('div')
            card.classList.add('card-cliente')

            card.innerHTML = `
                <h3>${cliente.nome}</h3>

                <p><strong>Email:</strong> ${cliente.email}</p>
                <p><strong>Telefone:</strong> ${cliente.telefone || 'Não informado'}</p>

                <hr>

                <p><strong>Agendamentos confirmados:</strong> ${agendamentosConfirmados.length}</p>
                <p><strong>Cancelamentos:</strong> ${agendamentosCancelados.length}</p>
                <p><strong>Última visita:</strong> ${ultimaVisita}</p>

                <p>
                    <strong>Total gasto:</strong>
                    ${totalGasto.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })}
                </p>

                <div class="historico-servicos">
                    <strong>Serviços realizados:</strong>

                    <ul>
                        ${listaServicos}
                    </ul>
                </div>
            `

            listaClientes.appendChild(card)

        })

    }catch(error){

        alert('Erro ao carregar clientes.')
        console.log(error)

    }

    }

    async function carregarDashboard(){
    try {
        const respostaAgendamentos = await fetch(API_AGENDAMENTOS)
        const dadosAgendamentos = await respostaAgendamentos.json()

        const respostaClientes = await fetch(API_CLIENTES, {
            headers: {
                'Authorization': `Bearer ${tokenAdmin}`
            }
        })
        const dadosClientes = await respostaClientes.json()

        const hoje = new Date()
        const hojeFormatado = hoje.toLocaleDateString('sv-SE')

        const inicioSemana = new Date(hoje)
        inicioSemana.setDate(hoje.getDate() - hoje.getDay())

        const anoAtual = hoje.getFullYear()
        const mesAtual = hoje.getMonth()

        const agendamentosConfirmados = dadosAgendamentos.agendamentos.filter(function(agendamento){
            return agendamento.statusAgendamento === 'confirmado'
        })

        const agendamentosHoje = agendamentosConfirmados.filter(function(agendamento){
            return agendamento.data === hojeFormatado
        })

        const agendamentosSemana = agendamentosConfirmados.filter(function(agendamento){
            const dataAgendamento = new Date(agendamento.data + 'T00:00:00')
            return dataAgendamento >= inicioSemana && dataAgendamento <= hoje
        })

        const agendamentosMes = agendamentosConfirmados.filter(function(agendamento){
            const dataAgendamento = new Date(agendamento.data + 'T00:00:00')
            return dataAgendamento.getFullYear() === anoAtual &&
                   dataAgendamento.getMonth() === mesAtual
        })

        totalAgendamentosHoje.textContent = agendamentosHoje.length
        totalClientes.textContent = dadosClientes.clientes.length
        totalConfirmados.textContent = agendamentosConfirmados.length

        const totalHoje = calcularFaturamento(agendamentosHoje)
        const totalSemana = calcularFaturamento(agendamentosSemana)
        const totalMes = calcularFaturamento(agendamentosMes)

        faturamentoHoje.textContent = formatarMoeda(totalHoje)
        faturamentoSemana.textContent = formatarMoeda(totalSemana)
        faturamentoMes.textContent = formatarMoeda(totalMes)

        servicoMaisVendido.textContent = encontrarMaisFrequente(
            agendamentosConfirmados,
            function(agendamento){
                return agendamento.servico?.nome
            }
        )

        clienteMaisFrequente.textContent = encontrarMaisFrequente(
            agendamentosConfirmados,
            function(agendamento){
                return agendamento.cliente?.nome
            }
        )

        const agora = new Date()

        const proximos = agendamentosHoje.filter(function(agendamento){
            const dataHora = new Date(`${agendamento.data}T${agendamento.horario}:00`)
            return dataHora >= agora
        })

        proximos.sort(function(a, b){
            return a.horario.localeCompare(b.horario)
        })

        if(proximos.length > 0){
            proximoAtendimento.textContent = `${proximos[0].horario} - ${proximos[0].cliente.nome}`
        }else{
            proximoAtendimento.textContent = '-'
        }

    } catch(error) {
        console.log(error)
        alert('Erro ao carregar dashboard financeiro.')
    }
    }
    function calcularFaturamento(listaAgendamentos){
    return listaAgendamentos.reduce(function(total, agendamento){
        return total + Number(agendamento.servico?.preco || 0)
    }, 0)
}

function formatarMoeda(valor){
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
}

function encontrarMaisFrequente(listaAgendamentos, pegarValor){
    const contador = {}

    listaAgendamentos.forEach(function(agendamento){
        const valor = pegarValor(agendamento)

        if(valor){
            contador[valor] = (contador[valor] || 0) + 1
        }
    })

    let maisFrequente = '-'
    let maiorQuantidade = 0

    Object.keys(contador).forEach(function(valor){
        if(contador[valor] > maiorQuantidade){
            maiorQuantidade = contador[valor]
            maisFrequente = valor
        }
    })

    return maisFrequente
    }

    async function carregarAgendaMes(){
        try{
            const respostaAgendamentos = await fetch(API_AGENDAMENTOS)
            const dadosAgendamentos = await respostaAgendamentos.json()

            calendarioAdmin.innerHTML = ''

            const hoje = new Date()
            const ano = hoje.getFullYear()
            const mes = hoje.getMonth()

            const quantidadeDias = new Date(ano, mes + 1, 0).getDate()

            const agendamentosConfirmados = dadosAgendamentos.agendamentos.filter(function(agendamento){
                return agendamento.statusAgendamento === 'confirmado'
            })

            for(let dia = 1; dia <= quantidadeDias; dia++){

                const dataFormatada = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`

                const agendamentosDoDia = agendamentosConfirmados.filter(function(agendamento){
                    return agendamento.data === dataFormatada
                })

                const cardDia = document.createElement('div')
                cardDia.classList.add('dia-calendario')

                if(agendamentosDoDia.length > 0){
                    cardDia.classList.add('dia-com-agendamento')
                }

                if(dataFormatada === hoje.toLocaleDateString('sv-SE')){
                    cardDia.classList.add('dia-hoje')
                }

                cardDia.innerHTML = `
                    <strong>${dia}</strong>

                    <span>
                        ${dataFormatada}
                    </span>

                    ${
                        agendamentosDoDia.length > 0
                        ? `<div class="badge-agendamento">${agendamentosDoDia.length} agendamento(s)</div>`
                        : `<span>Livre</span>`
                    }
                `

                calendarioAdmin.appendChild(cardDia)
            }

        }catch(error){
            alert('Erro ao carregar agenda do mês.')
            console.log(error)
        }
    }

})

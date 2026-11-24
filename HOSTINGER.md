# Publicação do EL LOBO na Hostinger

Esta branch prepara uma Web App Node.js. A publicação na conta Hostinger ainda não foi executada.

## Configuração da aplicação

- Repositório: `DiegodelPadua/projeto_barbearia_ellobo`.
- Branch de preparação: `codex/preparar-hostinger`.
- Diretório raiz: raiz do repositório (não selecionar somente `backEnd`, pois o servidor também publica `frontEnd`).
- Node.js: 22 LTS ou 24 LTS, conforme disponível no painel.
- Instalação: `npm ci` na raiz. O postinstall instala as dependências do back-end.
- Build: não há compilação de front-end. Se o painel exigir um comando de build, usar `node --check backEnd/app.js`.
- Inicialização: `npm start`. Caso o painel peça diretamente o arquivo de entrada, usar `backEnd/app.js`.
- Porta: o processo usa `PORT` fornecida pela hospedagem; o padrão local é 8080.
- Página pública: `/`. Administração: `/admin.html`.
- As páginas e a API usam o mesmo domínio; abrir o front-end pelo servidor Node.js, em vez do Live Server.

## Variáveis de ambiente

Cadastrar os valores somente no painel privado da hospedagem. Nunca enviar os valores reais ao GitHub ou ao chat.

- `NODE_ENV=production`
- `TZ=America/Sao_Paulo`
- `JWT_SECRET`: chave aleatória nova, mínimo 32 caracteres. Gerar localmente com `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
- `ADMIN_EMAIL`: email para acesso administrativo.
- `ADMIN_PASSWORD`: senha NOVA com pelo menos 16 caracteres, diferente da senha já presente no repositório público. Em produção o login usa estas variáveis, em vez da senha do JSON.
- `DATA_DIR`: caminho absoluto de uma pasta persistente, com leitura e escrita pelo processo Node.js, preservada após deploy e rollback.

A aplicação recusa iniciar em produção sem as variáveis obrigatórias. Os tokens anteriores deixam de funcionar após mudar JWT_SECRET: fazer login novamente.

## Dados persistentes: confirmar antes de receber clientes

Não basta confirmar que o plano executa Node.js. Verificar na documentação ou suporte da Hostinger se a Web App permite uma pasta de dados gravável que seja mantida entre deploys, e qual é seu caminho absoluto. Não presumir que a pasta do código permanece intacta após uma atualização.

A pasta DATA_DIR deve conter seis arquivos JSON válidos: `clientes.json`, `colaboradores.json`, `agendamentos.json`, `bloqueios.json`, `servicos.json` e `horarios.json`. A configuração apenas escolhe o caminho: não copia nem migra dados automaticamente. Preservar os dados atuais e manter backup antes de qualquer migração. Para uma instalação nova, clientes/agendamentos/bloqueios podem começar como listas vazias, mas a decisão deve ser explícita; não sobrescrever uma instalação existente.

Se Web Apps não oferecer armazenamento persistente adequado, será necessário decidir entre uma base persistente (por exemplo, banco incluído no plano) e uma VPS. Essa mudança de armazenamento ainda não foi feita.

Para JSON, executar somente UM processo/instância Node.js. A proteção contra conflito de horários atua dentro de um processo; não oferece transações entre múltiplos processos. Configurar backup dos seis arquivos fora da pasta de deploy e testar restauração. A escrita JSON ainda não é transacional nem atômica contra interrupção de energia/processo; a versão atual também precisa de revisão adicional das regras de disponibilidade no servidor e entradas antes de produção com clientes reais.

O repositório público já contém registros de cadastro e uma credencial administrativa. Não reutilizar a senha publicada. Remover esses dados do histórico exige trabalho separado, preservando backup e com decisão explícita do responsável; esta branch não apaga os dados existentes.

## Verificação na Hostinger

1. Criar uma aplicação separada do site já hospedado e usar URL temporária para validação.
2. Confirmar persistência e preparar DATA_DIR com backup. Configurar variáveis privadas.
3. Implantar esta branch e conferir logs de inicialização.
4. Testar página inicial, cadastro, login, reserva, Meus Agendamentos, reagendamento, cancelamento e painel administrativo.
5. Com dois clientes de teste, confirmar que um não consegue consultar ou alterar reservas do outro.
6. Reiniciar a aplicação e executar novo deploy de teste: os registros devem continuar presentes nas duas situações. Um teste local de reinício não comprova a persistência do serviço Hostinger.
7. Só após validar armazenamento e fluxos, vincular o domínio do EL LOBO e verificar HTTPS. Não alterar o domínio do site já hospedado para fazer esse teste.

## Validação realizada no ambiente de desenvolvimento

Instalação limpa das dependências do back-end; verificação de sintaxe dos JavaScript alterados; testes HTTP com JSON sintético isolado para páginas, login administrativo, cadastro com JWT, endpoints protegidos, identidade do cliente derivada do token, isolamento de leitura e alteração entre dois clientes, cancelamento/reagendamento autorizados, omissão de senhas na listagem e manutenção de dados após reinício local. Oito pedidos concorrentes para o mesmo horário produziram uma reserva e sete respostas de conflito.

Essas verificações não substituem testes no serviço Hostinger nem uma auditoria completa de segurança. A branch é uma preparação para publicação, não uma declaração de prontidão para produção.

# ObraFácil Roadmap

## Versão Atual

v0.8.2

Resumo do que já foi implementado:

- Autenticação básica (login/cadastro) com sessão por cookie
- Cadastro de solicitações (`SolicitarServico`) e vínculo com `Profissional`
- Envio e listagem de propostas (`Proposta`) com status `PENDENTE`/`ACEITA`/`RECUSADA`
- Fluxo de chat cliente ↔ profissional
- Painel do profissional e área do cliente
- Componentes reutilizáveis de chat e UI básica
- Sistema de lint/build/Prisma configured

---------------------------------------------------------

## ROADMAP V0.9

### ÉPICO 1
Execução do Serviço

Sprint 09.1

- Serviço iniciado
- Status EM_ANDAMENTO

Sprint 09.2

- Profissional finaliza serviço
- Status AGUARDANDO_CONFIRMACAO

Sprint 09.3

- Cliente confirma conclusão
- Status FINALIZADO

---------------------------------------------------------

### ÉPICO 2
Avaliações

- Nota
- Comentário
- Média do profissional

---------------------------------------------------------

### ÉPICO 3
Dashboards

Cliente

- Serviços ativos
- Histórico
- Propostas
- Avaliações

Profissional

- Serviços ativos
- Histórico
- Receita estimada
- Avaliação média

---------------------------------------------------------

### ÉPICO 4
Favoritos

- Cliente favoritar profissional

=========================================================
ROADMAP V1.0
=========================================================

Planejar:

- Administração
- Moderação
- Notificações
- Docker
- CI/CD
- Deploy
- Produção

=========================================================
ROADMAP V2.0
=========================================================

Planejar apenas como visão futura:

- PIX
- Stripe
- Agenda
- IA
- Recomendações
- Aplicativo Mobile

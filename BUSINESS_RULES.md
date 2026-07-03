# BUSINESS RULES

## Introdução

Este documento define as regras de negócio oficiais do sistema ObraFácil. Ele serve como referência para desenvolvimento, especificação e governança, garantindo consistência entre funcionalidades, fluxos e decisões de produto.

## Objetivo do documento

Formalizar as regras de negócio que regem cadastro, solicitações, propostas, execução do serviço, chat, avaliações e administração. O documento deve apoiar o time na tomada de decisões e na validação de requisitos.

## Escopo

Cobertura das regras de negócio para os módulos atuais e planejamento de futuras funcionalidades relacionadas a avaliações e administração. Não implementa código, apenas documentação.

## Glossário

- Cliente: usuário que solicita serviço.
- Profissional: usuário que oferece serviço.
- Solicitação: requisição de serviço criada pelo cliente (`SolicitarServico`).
- Proposta: oferta enviada pelo profissional para atender a solicitação.
- Aceite: ato do cliente selecionar uma proposta como vencedora.
- Recusa: rejeição de uma proposta.
- Serviço: execução contratada após aceite de proposta.
- Chat: comunicação entre cliente e profissional ligada à solicitação.
- Admin: usuário administrativo responsável por moderação e disputas.

---

## MÓDULO 01
Cadastro

RN001
Cadastro de Cliente

Objetivo
Permitir que novos clientes se registrem no sistema para criar solicitações e contratar profissionais.

Descrição
O cliente fornece nome, email, senha e dados de contato. O sistema valida unicidade de email e cria os registros em `User` e `Cliente`.

Atores
- Cliente

Pré-condições
- Email válido e não cadastrado
- Senha atende requisitos mínimos

Fluxo principal
1. Cliente acessa a tela de cadastro.
2. Preenche nome, email, senha e telefone.
3. Submete o formulário.
4. Sistema valida dados e cria usuário e cliente.
5. Sistema redireciona para login ou sessão autenticada.

Fluxos alternativos
- Se o email já existir, exibir erro e solicitar login.
- Se a validação de senha falhar, exibir mensagens de correção.

Exceções
- Falhas de persistência no banco.
- Problemas de rede durante a requisição.

Critérios de aceite
- Registro criado com sucesso.
- Usuário autenticado ou redirecionado para login.
- Email duplicado bloqueado.

Impacto no banco
- Criação de registros nas tabelas `users` e `clients`.

Impacto nas APIs
- API `POST /api/auth/register` deve suportar cadastro de cliente.

Impacto na UX
- Formulário de cadastro claro e mensagens de erro amigáveis.

Prioridade
Alta

Status
Planejado

---

RN002
Cadastro de Profissional

Objetivo
Permitir que novos profissionais se registrem para receber propostas e atender solicitações.

Descrição
O profissional fornece nome, email, senha, especialidade e dados de contato. O sistema valida unicidade de email e cria os registros em `User` e `Profissional`.

Atores
- Profissional

Pré-condições
- Email válido e não cadastrado
- Senha atende requisitos mínimos
- Especialidade selecionada

Fluxo principal
1. Profissional acessa a tela de cadastro.
2. Preenche nome, email, senha, telefone e especialidade.
3. Submete o formulário.
4. Sistema valida dados e cria usuário e profissional.
5. Sistema redireciona para login ou sessão autenticada.

Fluxos alternativos
- Se o email já existir, exibir erro e sugerir login.
- Se a especialidade estiver ausente, solicitar preenchimento.

Exceções
- Falhas de persistência no banco.
- Problemas de rede.

Critérios de aceite
- Registro criado com sucesso.
- Profissional pode acessar painel de propostas.
- Email duplicado bloqueado.

Impacto no banco
- Criação de registros nas tabelas `users` e `professionals`.

Impacto nas APIs
- API `POST /api/auth/register` deve suportar cadastro de profissional.

Impacto na UX
- Formulário de cadastro com campos específicos para profissional.

Prioridade
Alta

Status
Planejado

---

RN003
Categorias

Objetivo
Permitir a gestão e uso de categorias de serviço para organizar o marketplace.

Descrição
Categorias definem áreas de atuação dos profissionais e ajudam o cliente a filtrar serviços.

Atores
- Sistema
- Administrador (futuro)

Pré-condições
- Categoria deve ter nome único

Fluxo principal
1. Categoria é criada no sistema.
2. Serviços e profissionais podem ser associados a categorias.
3. Clientes filtram profissionais por categoria.

Fluxos alternativos
- Categoria duplicada não é criada.
- Categoria inativa não aparece em listagens.

Exceções
- Falha de persistência no banco.

Critérios de aceite
- Categorias disponíveis para seleção e filtro.
- Nome único garantido.

Impacto no banco
- Tabela `categories` ou `CategoriaServico` existente.

Impacto nas APIs
- API `GET /api/categorias` para listar categorias.

Impacto na UX
- Dropdown/busca de categorias no marketplace.

Prioridade
Média

Status
Planejado

---

## MÓDULO 02
Solicitações

RN004
Criação da solicitação

Objetivo
Permitir que o cliente crie uma solicitação de serviço com título, descrição e dados básicos.

Descrição
O cliente cria uma solicitação que representa a demanda de serviço. Pode conter vínculo opcional com profissional.

Atores
- Cliente

Pré-condições
- Cliente autenticado
- Dados obrigatórios preenchidos

Fluxo principal
1. Cliente acessa tela de nova solicitação.
2. Preenche título, descrição, categoria e opção de profissional.
3. Submete a solicitação.
4. Sistema salva e exibe solicitação em `/meus-pedidos`.

Fluxos alternativos
- Se faltar campo obrigatório, exibir mensagem de validação.
- Se o profissional selecionado não existir, exibir erro.

Exceções
- Falha de persistência no banco.

Critérios de aceite
- Solicitação criada e visível no painel do cliente.

Impacto no banco
- Criação de registro em `SolicitarServico`.

Impacto nas APIs
- API `POST /api/solicitacoes` deve salvar a solicitação.

Impacto na UX
- Formulário de solicitação simples e claro.

Prioridade
Alta

Status
Planejado

---

RN005
Edição de solicitação

Objetivo
Permitir que o cliente edite uma solicitação enquanto ela não estiver em andamento.

Descrição
O cliente pode ajustar título, descrição ou prioridade antes do serviço começar.

Atores
- Cliente

Pré-condições
- Cliente autenticado
- Solicitação pertence ao cliente
- Solicitação não está `EM_ANDAMENTO` ou finalizada

Fluxo principal
1. Cliente abre a solicitação pendente.
2. Edita campos permitidos.
3. Salva alterações.
4. Sistema atualiza o registro.

Fluxos alternativos
- Se a solicitação estiver em andamento, impedir edição.

Exceções
- Tentativa de editar solicitação de outro cliente.

Critérios de aceite
- Alterações salvas apenas em solicitações permissíveis.

Impacto no banco
- Atualização de registro em `SolicitarServico`.

Impacto nas APIs
- API `PATCH /api/solicitacoes/[id]` precisa validar permissão e estado.

Impacto na UX
- Botão de editar disponível apenas quando permitido.

Prioridade
Média

Status
Planejado

---

RN006
Cancelamento de solicitação

Objetivo
Permitir que o cliente cancele uma solicitação antes ou durante o processo de contratação.

Descrição
O cliente encerra a solicitação e impede novas propostas ou ações posteriores.

Atores
- Cliente

Pré-condições
- Cliente autenticado
- Solicitação pertence ao cliente

Fluxo principal
1. Cliente solicita cancelamento.
2. Sistema confirma a ação.
3. Solicitação recebe status `CANCELADA`.

Fluxos alternativos
- Se há proposta aceita, exibir aviso de impacto.

Exceções
- Tentativa de cancelar solicitação de outro cliente.

Critérios de aceite
- Solicitação cancelada e não aceitam novas propostas.

Impacto no banco
- Atualização de status em `SolicitarServico`.

Impacto nas APIs
- API de cancelamento deve validar propriedade.

Impacto na UX
- Mensagem de confirmação antes do cancelamento.

Prioridade
Média

Status
Planejado

---

RN007
Visualização de solicitação

Objetivo
Permitir que clientes e profissionais visualizem detalhes da solicitação.

Descrição
A solicitação mostra título, descrição, status, cliente, profissional (se houver) e histórico.

Atores
- Cliente
- Profissional

Pré-condições
- Usuário autenticado
- Acesso autorizado à solicitação

Fluxo principal
1. Usuário acessa a página da solicitação.
2. Sistema exibe detalhes e propostas associadas.

Fluxos alternativos
- Profissional não cadastrado como proprietário vê apenas solicitações disponíveis.

Exceções
- Acesso negado a solicitações privadas.

Critérios de aceite
- Informações corretas exibidas ao usuário autorizado.

Impacto no banco
- Leitura de `SolicitarServico` e relacionamentos.

Impacto nas APIs
- API `GET /api/solicitacoes/[id]` deve retornar dados completos.

Impacto na UX
- Layout claro para dados da solicitação.

Prioridade
Alta

Status
Planejado

---

RN008
Relacionamentos de solicitação

Objetivo
Garantir que a solicitação mantenha relações corretas com cliente, profissional e propostas.

Descrição
Solicitações são vinculadas a cliente e profissional (opcional) e agregam propostas.

Atores
- Sistema

Pré-condições
- Entidades relacionadas existem

Fluxo principal
1. Ao criar solicitação, vincula cliente.
2. Ao associar profissional, atualiza vínculo.
3. Propostas são relacionadas à solicitação.

Fluxos alternativos
- Solicitação sem profissional ainda aceita propostas.

Exceções
- Vínculo inválido impede criação.

Critérios de aceite
- Relacionamentos consistentes no banco.

Impacto no banco
- Chaves estrangeiras entre `SolicitarServico`, `Cliente`, `Profissional` e `Proposta`.

Impacto nas APIs
- Endpoints devem incluir dados relacionados conforme necessário.

Impacto na UX
- Exibição consistente de cliente/profissional/propostas.

Prioridade
Alta

Status
Planejado

---

## MÓDULO 03
Propostas

RN010
Envio de proposta

Objetivo
Permitir que profissionais enviem propostas para solicitações disponíveis.

Descrição
O profissional envia valor, prazo e mensagem para ofertar atendimento.

Atores
- Profissional

Pré-condições
- Profissional autenticado
- Solicitação aberta

Fluxo principal
1. Profissional acessa solicitação.
2. Preenche valor, prazo e mensagem.
3. Submete proposta.
4. Sistema salva proposta em `PENDENTE`.

Fluxos alternativos
- Se já houver proposta para a mesma solicitação, continuar permitindo novos envios.

Exceções
- Envio por profissional não autenticado.
- Envio para solicitação com status inválido.

Critérios de aceite
- Proposta salva com status `PENDENTE`.
- Profissional pode visualizar proposta enviada.

Impacto no banco
- Criação de registro em `Proposta`.

Impacto nas APIs
- API `POST /api/propostas` deve validar e persistir a proposta.

Impacto na UX
- Formulário de proposta disponível na página do profissional.

Prioridade
Alta

Status
Planejado

---

RN011
Visualização

Objetivo
Permitir que usuário veja propostas relacionadas a uma solicitação.

Descrição
Cliente e profissional visualizam propostas com status, valor e prazo.

Atores
- Cliente
- Profissional

Pré-condições
- Usuário autenticado
- Proposta relacionada à solicitação

Fluxo principal
1. Usuário acessa lista de propostas.
2. Sistema exibe propostas e status.

Fluxos alternativos
- Proposta aceita aparece destacada.

Exceções
- Acesso negado a propostas de outra solicitação.

Critérios de aceite
- Propostas exibidas apenas a usuários autorizados.

Impacto no banco
- Leitura de `Proposta` e relacionamentos.

Impacto nas APIs
- API `GET /api/propostas` deve filtrar por cliente/profissional/solicitação.

Impacto na UX
- Exibição clara de status e detalhes.

Prioridade
Alta

Status
Planejado

---

RN012
Aceite

Objetivo
Permitir que o cliente aceite uma proposta para iniciar a contratação.

Descrição
Ao aceitar, uma proposta é marcada como `ACEITA` e dá início ao fluxo de serviço.

Atores
- Cliente

Pré-condições
- Cliente autenticado
- Proposta pertence à solicitação do cliente
- Proposta está `PENDENTE`

Fluxo principal
1. Cliente escolhe proposta.
2. Clica em aceitar.
3. Sistema atualiza proposta para `ACEITA`.

Fluxos alternativos
- Se já existe outra proposta aceita, operação é bloqueada.

Exceções
- Tentativa de aceitar proposta de outra solicitação.

Critérios de aceite
- Proposta aceita e status atualizado corretamente.

Impacto no banco
- Atualização de status em `Proposta`.

Impacto nas APIs
- API `PATCH /api/propostas/[id]` deve suportar aceite.

Impacto na UX
- Botão de aceite visível apenas para cliente e proposta pendente.

Prioridade
Alta

Status
Planejado

---

RN013
Recusa

Objetivo
Permitir que o cliente recuse uma proposta sem interferir em outras propostas.

Descrição
O cliente recusa uma proposta, alterando seu status para `RECUSADA`.

Atores
- Cliente

Pré-condições
- Cliente autenticado
- Proposta pertence à solicitação do cliente

Fluxo principal
1. Cliente seleciona recusar em uma proposta.
2. Sistema atualiza status para `RECUSADA`.

Fluxos alternativos
- Cliente recusa várias propostas.

Exceções
- Tentativa de recusar proposta aceita.

Critérios de aceite
- Proposta atualizada para `RECUSADA`.

Impacto no banco
- Atualização de status em `Proposta`.

Impacto nas APIs
- API `PATCH /api/propostas/[id]` deve suportar recusa.

Impacto na UX
- Botão de recusa disponível apenas para propostas pendentes.

Prioridade
Alta

Status
Planejado

---

RN014
Atualização automática das demais propostas

Objetivo
Garantir que somente uma proposta seja aceita por solicitação.

Descrição
Ao aceitar uma proposta, todas as demais são automaticamente recusadas.

Atores
- Sistema

Pré-condições
- Proposta aceita para solicitação

Fluxo principal
1. Cliente aceita proposta.
2. Sistema marca outras propostas da mesma solicitação como `RECUSADA`.

Fluxos alternativos
- Nenhum; operação é atômica.

Exceções
- Existência de proposta já aceita antes da operação.

Critérios de aceite
- Uma proposta é `ACEITA`; demais ficam `RECUSADA`.

Impacto no banco
- Atualização em massa de `Proposta` com `solicitacaoId` igual.

Impacto nas APIs
- API `PATCH /api/propostas/[id]` deve usar transação atômica.

Impacto na UX
- Cliente vê apenas uma proposta aceita por solicitação.

Prioridade
Alta

Status
Planejado

---

RN015
Mudança da solicitação para EM_ANDAMENTO

Objetivo
Atualizar o status da solicitação quando uma proposta é aceita.

Descrição
Ao aceitar proposta, a solicitação correspondente passa para `EM_ANDAMENTO`.

Atores
- Sistema

Pré-condições
- Proposta aceita

Fluxo principal
1. Cliente aceita proposta.
2. Sistema atualiza `SolicitarServico.status` para `EM_ANDAMENTO`.

Fluxos alternativos
- Nenhum; operação deve ser atômica com o aceite.

Exceções
- Falha na atualização de status da solicitação.

Critérios de aceite
- Solicitação com estado `EM_ANDAMENTO` após aceite.

Impacto no banco
- Atualização de status em `SolicitarServico`.

Impacto nas APIs
- API `PATCH /api/propostas/[id]` deve atualizar também a solicitação.

Impacto na UX
- Visualizar status de serviço em andamento para cliente e profissional.

Prioridade
Alta

Status
Planejado

---

RN016
Restrições de autorização

Objetivo
Garantir que apenas usuários autorizados executem ações de proposta.

Descrição
Clientes só aceitam/recusam suas próprias propostas; profissionais só visualizam e enviam propostas.

Atores
- Cliente
- Profissional

Pré-condições
- Usuário autenticado
- Sessão válida

Fluxo principal
1. Usuário acessa ação de proposta.
2. Sistema verifica propriedade e papel.
3. Permite/nega ação.

Fluxos alternativos
- Profissional tenta acessar ação de aceite.
- Cliente tenta recusar proposta de outra solicitacao.

Exceções
- Acesso negado retorna 403.

Critérios de aceite
- Apenas usuários autorizados executam ações.

Impacto no banco
- Leitura de campos de propriedade para validação.

Impacto nas APIs
- Autorização deve ser checada em `PATCH /api/propostas/[id]` e demais endpoints.

Impacto na UX
- Botões ocultos para usuários não autorizados.

Prioridade
Alta

Status
Planejado

---

## MÓDULO 04
Execução do Serviço

RN020
Início do serviço

Objetivo
Registrar o momento em que o profissional inicia a execução do serviço.

Descrição
Após aceitação de proposta, o profissional marca o serviço como iniciado e o sistema registra `startedAt`.

Atores
- Profissional

Pré-condições
- Proposta aceita
- Solicitação em andamento

Fluxo principal
1. Profissional acessa solicitação aceita.
2. Clica em iniciar serviço.
3. Sistema registra `startedAt` e atualiza status para `EM_ANDAMENTO`.

Fluxos alternativos
- Se já estiver iniciado, exibir que o serviço já começou.

Exceções
- Tentativa de iniciar serviço por usuário não contratado.

Critérios de aceite
- `startedAt` registrado com timestamp.
- `updatedAt` atualizado.
- Uso de `prisma.$transaction` no backend.

Impacto no banco
- Campo `startedAt` em `SolicitarServico`.

Impacto nas APIs
- API `PATCH /api/solicitacoes/[id]` deve validar profissional e status.

Impacto na UX
- Botão "Iniciar Serviço" disponível apenas ao profissional contratado enquanto a solicitação estiver `ACEITA`.

Prioridade
Alta

Status
Implementado

---

RN021
Serviço em andamento

Objetivo
Representar o estado de execução do serviço com acompanhamento de progresso.

Descrição
O serviço em andamento permite ao profissional reportar progresso e ao cliente acompanhar status.

Atores
- Profissional
- Cliente

Pré-condições
- Serviço iniciado

Fluxo principal
1. Profissional reporta progresso por meio de mensagens ou status.
2. Cliente visualiza progresso em dashboard.

Fluxos alternativos
- Progresso não reportado ainda; exibir estado padrão.

Exceções
- Tentativa de reportar progresso fora do estado correto.

Critérios de aceite
- Estado `EM_ANDAMENTO` refletido e progresso disponível.

Impacto no banco
- Possível tabela de eventos ou mensagens vinculadas.

Impacto nas APIs
- Endpoints de progresso e chat devem suportar status.

Impacto na UX
- Timeline ou etiqueta de estado visível.

Prioridade
Média

Status
Planejado

---

RN022
Finalização

Objetivo
Permitir que o profissional marque o serviço como concluído e envie evidências.

Descrição
Quando o trabalho termina, o profissional fecha a etapa de execução para revisão do cliente.

Atores
- Profissional
- Cliente

Pré-condições
- Serviço em andamento

Fluxo principal
1. Profissional marca serviço como concluído.
2. Sistema atualiza status para `AGUARDANDO_CONFIRMACAO`.
3. Cliente recebe notificação.

Fluxos alternativos
- Cliente solicitar correções antes da confirmação.

Exceções
- Tentativa de finalizar sem iniciar.

Critérios de aceite
- Status de conclusão registrado.

Impacto no banco
- Campo `finishedAt` ou tabela de eventos para conclusão.

Impacto nas APIs
- Endpoint de finalização deve validar estado e autorização.

Impacto na UX
- Ação de finalizar disponível apenas ao profissional contratado.

Prioridade
Alta

Status
Planejado

---

RN023
Confirmação do cliente

Objetivo
Permitir que o cliente confirme a conclusão do serviço e encerre o ciclo.

Descrição
O cliente revisa o serviço concluído e confirma o resultado, finalizando a solicitação.

Atores
- Cliente

Pré-condições
- Serviço marcado como concluído
- Cliente dono da solicitação

Fluxo principal
1. Cliente avalia conclusão.
2. Confirma o término do serviço.
3. Sistema atualiza status para `FINALIZADO`.

Fluxos alternativos
- Cliente recusa e solicita ajustes.

Exceções
- Tentativa de confirmação por usuário não dono.

Critérios de aceite
- Solicitação finalizada corretamente.

Impacto no banco
- Atualização de status final em `SolicitarServico`.

Impacto nas APIs
- Endpoint de confirmação deve validar propriedade e estado.

Impacto na UX
- Botão de confirmar disponível apenas ao cliente.

Prioridade
Alta

Status
Planejado

---

RN024
Status FINALIZADO

Objetivo
Definir o estado final do ciclo de serviço.

Descrição
A solicitação `FINALIZADO` indica que o serviço foi concluído e confirmado pelo cliente.

Atores
- Sistema

Pré-condições
- Confirmação pelo cliente

Fluxo principal
1. Sistema aplica status `FINALIZADO`.
2. Serviço não permite mais ações de execução.

Fluxos alternativos
- Sistema exibe histórico e avaliações após finalização.

Exceções
- Nenhuma ação adicional permitida no estado final.

Critérios de aceite
- Status final exibido e ação bloqueada.

Impacto no banco
- Status em `SolicitarServico` marcado como finalizado.

Impacto nas APIs
- Endpoints de escrita devem recusar alterações quando finalizado.

Impacto na UX
- Tela de serviço finalizado com resumo.

Prioridade
Alta

Status
Planejado

---

RN025
startedAt

Objetivo
Documentar o uso do timestamp de início de serviço.

Descrição
Campo `startedAt` registra o momento em que o profissional inicia a execução.

Atores
- Sistema

Pré-condições
- Profissional inicia o serviço

Fluxo principal
1. Profissional clica em iniciar.
2. Sistema grava `startedAt`.

Fluxos alternativos
- Se já existe `startedAt`, não regravar.

Exceções
- Tentativa de iniciar por usuário não autorizado.

Critérios de aceite
- Timestamp salvo para serviço iniciado.

Impacto no banco
- Campo `startedAt` em `SolicitarServico` (documentado apenas).

Impacto nas APIs
- Endpoint de início retorna `startedAt`.

Impacto na UX
- Exibir data/hora de início no serviço.

Prioridade
Média

Status
Planejado

---

RN026
finishedAt

Objetivo
Documentar o uso do timestamp de término do serviço.

Descrição
Campo `finishedAt` registra o momento em que o serviço foi marcado como concluído.

Atores
- Sistema

Pré-condições
- Profissional finaliza o serviço

Fluxo principal
1. Profissional clica em finalizar serviço.
2. Sistema grava `finishedAt`.

Fluxos alternativos
- Se o serviço for reaberto, manter histórico.

Exceções
- Tentativa de finalizar serviço não iniciado.

Critérios de aceite
- Timestamp salvo para serviço concluído.

Impacto no banco
- Campo `finishedAt` em `SolicitarServico`.

Impacto nas APIs
- Endpoint de finalização retorna `finishedAt`.

Impacto na UX
- Exibir data/hora de conclusão no resumo.

Prioridade
Média

Status
Planejado

---

## MÓDULO 05
Chat

RN030
Quem pode conversar

Objetivo
Definir quais usuários podem usar o chat vinculado à solicitação.

Descrição
A comunicação é permitida entre o cliente e o profissional vinculados à solicitação.

Atores
- Cliente
- Profissional

Pré-condições
- Solicitação ativa ou em andamento

Fluxo principal
1. Cliente/profissional acessam chat da solicitação.
2. Enviam mensagens.

Fluxos alternativos
- Mensagem de sistema registra eventos de status.

Exceções
- Usuário sem vínculo não pode enviar mensagens.

Critérios de aceite
- Somente cliente e profissional vinculados conseguem conversar.

Impacto no banco
- Mensagens gravadas em `MensagemSolicitacao`.

Impacto nas APIs
- Endpoint de mensagem valida vínculo.

Impacto na UX
- Chat disponível apenas para participantes.

Prioridade
Alta

Status
Planejado

---

RN031
Quando pode conversar

Objetivo
Definir os momentos em que o chat está disponível.

Descrição
Chat está disponível enquanto a solicitação não estiver finalizada ou cancelada.

Atores
- Cliente
- Profissional

Pré-condições
- Solicitação em estado ativo

Fluxo principal
1. Usuário acessa chat.
2. Sistema permite envio de mensagens se status permitir.

Fluxos alternativos
- Chat em modo somente leitura após finalização.

Exceções
- Solicitação cancelada bloqueia mensagens.

Critérios de aceite
- Chat disponível em estados permitidos.

Impacto no banco
- Leitura de status de `SolicitarServico`.

Impacto nas APIs
- Endpoint valida status da solicitação.

Impacto na UX
- Mensagem de bloqueio quando indisponível.

Prioridade
Média

Status
Planejado

---

RN032
Quando não pode conversar

Objetivo
Impedir comunicação em casos indisponíveis.

Descrição
O chat é bloqueado após cancelamento ou finalização da solicitação.

Atores
- Cliente
- Profissional

Pré-condições
- Solicitação cancelada ou finalizada

Fluxo principal
1. Usuário tenta enviar mensagem.
2. Sistema recusa a ação.

Fluxos alternativos
- Exibir histórico de mensagens anteriores.

Exceções
- Nenhuma mensagem enviada.

Critérios de aceite
- Envio bloqueado quando apropriado.

Impacto no banco
- Verificação de status em `SolicitarServico`.

Impacto nas APIs
- Endpoint retorna erro ao enviar mensagem.

Impacto na UX
- Feedback claro de motivo.

Prioridade
Média

Status
Planejado

---

RN033
Permissões

Objetivo
Definir permissões do chat por papel e vínculo.

Descrição
Somente cliente e profissional vinculados têm permissão de envio; outros podem apenas visualizar quando autorizado.

Atores
- Cliente
- Profissional
- Admin

Pré-condições
- Sessão autenticada

Fluxo principal
1. Sistema valida papel e vínculo.
2. Permite ou nega envio.

Fluxos alternativos
- Admin pode visualizar histórico de eventos.

Exceções
- Acesso negado retorna 403.

Critérios de aceite
- Permissões aplicadas corretamente.

Impacto no banco
- Validação de vínculo e papel.

Impacto nas APIs
- Autorização no endpoint de mensagens.

Impacto na UX
- Mensagens e ações de usuário restritas.

Prioridade
Alta

Status
Planejado

---

## MÓDULO 06
Avaliações

RN040
Planejamento de Avaliações

Objetivo
Documentar regras para o futuro módulo de avaliações.

Descrição
Avaliações permitirão nota e comentário após conclusão do serviço.

Atores
- Cliente
- Profissional

Pré-condições
- Solicitação `FINALIZADO`

Fluxo principal
1. Cliente avalia o profissional.
2. Sistema registra nota e comentário.

Fluxos alternativos
- Avaliação pode ser editada dentro de prazo.

Exceções
- Avaliação não permitida se serviço não finalizado.

Critérios de aceite
- Avaliação criada associada à solicitação.

Impacto no banco
- Tabela `Avaliação` com nota e comentário.

Impacto nas APIs
- Endpoints de avaliação futuros.

Impacto na UX
- Formulário de avaliação após finalização.

Prioridade
Média

Status
Planejado

---

## MÓDULO 07
Administração

RN050
Planejamento de Administração

Objetivo
Documentar regras para futuras funcionalidades administrativas.

Descrição
Administração será responsável por relatórios, logs, moderação e gestão de disputas.

Atores
- Admin

Pré-condições
- Usuário administrativo autenticado

Fluxo principal
1. Admin acessa painel.
2. Visualiza relatórios e logs.
3. Intervém em disputas.

Fluxos alternativos
- Administração de conteúdo e usuários.

Exceções
- Acesso negado a usuários não administradores.

Critérios de aceite
- Permissões administrativas definidas.

Impacto no banco
- Possível tabela de logs e auditoria.

Impacto nas APIs
- Endpoints administrativos futuros.

Impacto na UX
- Painel administrativo dedicado.

Prioridade
Média

Status
Planejado

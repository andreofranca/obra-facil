# CODEX_AGENT

Este arquivo define as diretrizes de execução para o projeto ObraFácil.

## Princípios Gerais

- Nunca modificar a arquitetura sem justificar claramente a razão.
- Nunca remover código sem informar no relatório final e no `PROJECT_STATUS.md`.
- Sempre atualizar `PROJECT_STATUS.md` ao final de qualquer atividade.
- Sempre executar:
  - `npm run lint`
  - `npm run build`
- Nunca utilizar `any` quando houver alternativa tipada.
- Reutilizar componentes existentes sempre que possível.
- Seguir o padrão e estilo já utilizados no projeto.
- Não implementar novas funcionalidades de negócio durante a estabilização técnica.
- Não alterar regras de negócio.
- Não modificar modelos do Prisma além do necessário para correções.
- Não criar migrations.
- Não alterar o fluxo das telas.

## Relatório Final Obrigatório

Ao final de cada execução, o resultado deve obrigatoriamente conter o cabeçalho:

## RESUMO DA EXECUÇÃO

E incluir as seções:

- Objetivo
- Arquivos criados
- Arquivos alterados
- Banco impactado
- Rotas impactadas
- Validações
- Pendências
- Próximo passo
- Status

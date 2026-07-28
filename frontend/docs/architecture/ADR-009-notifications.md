# ADR 009: Sistema de Notificações (Toasts)

## Contexto
A aplicação precisa alertar usuários sobre sucesso, falha ou avisos gerais decorrentes de suas ações. 

## Problema
Componentes espalhados gerenciavam o estado de sucesso/erro isoladamente, causando inconsistência visual e acoplamento. Injetar bibliotecas como `react-toastify` ou `sonner` trazia excesso de complexidade e dependência de terceiros.

## Alternativas
1. Utilizar biblioteca externa (ex: Sonner, React Toastify).
2. Criar sistema próprio via React Context.
3. Utilizar estado global (Zustand/Redux) para controlar mensagens.

## Decisão
Decidimos utilizar a alternativa 2: Criar um sistema próprio via React Context API (`NotificationProvider` e `useToast`).

## Consequências
- **Positivas**: Redução no tamanho do bundle. Total controle sobre a acessibilidade (`aria-live="polite"`) e estilo sem *overrides* de CSS. API imperativa simples (`toast.success("OK")`).
- **Negativas**: A gestão da pilha (stacking) de múltiplos toasts exige manutenção própria e cuidado com performance de renders, se o array crescer.

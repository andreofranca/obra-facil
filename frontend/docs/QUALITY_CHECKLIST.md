# Checklist de Qualidade (Quality Checklist)

O checklist a seguir deve ser consultado durante as etapas de *Code Review* de PRs que entreguem interfaces e fluxos críticos.

## 1. Testes
- [ ] A lógica de negócio / helper foi coberta por testes unitários (`vitest`)?
- [ ] O componente visual possui renderização testada via React Testing Library?
- [ ] Os fluxos críticos adicionaram cobertura no spec do Playwright (E2E)?

## 2. Acessibilidade
- [ ] O componente suporta interações pelo teclado (`Tab`, `Enter`, `Escape`)?
- [ ] O componente foi validado pelo `jest-axe` com `toHaveNoViolations()`?
- [ ] Botões puramente de ícones (sem texto) utilizam `aria-label`?
- [ ] Elementos mutáveis ou de *loading* utilizam atributos ARIA adequados (`aria-busy`, `aria-live`)?

## 3. Performance
- [ ] Foram incluídas bibliotecas muito grandes sem necessidade (ex: moment.js, lodash total)?
- [ ] Imagens estão utilizando o componente `next/image` ou ao menos lazy-loading?
- [ ] O código evita *re-renders* desnecessários com uso adequado de `useMemo` ou estrutura isolada de componentes?

## 4. Arquitetura
- [ ] Respeita o Clean Code e não expõe regras de backend na view do frontend?
- [ ] Utilizou a estrutura global da `Platform Layer` em vez de criar lógicas duplicadas (como modais ou overlays)?

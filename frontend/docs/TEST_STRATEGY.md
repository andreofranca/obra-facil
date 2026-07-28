# Estratégia de Testes

## Níveis de Teste

A pirâmide de testes do projeto ObraFácil está estruturada em quatro pilares principais, com foco na eficiência, ROI (Retorno sobre Investimento) e agilidade no loop de feedback para desenvolvedores.

### 1. Testes Unitários (Vitest)
Foco em funções puras, validadores, helpers e algoritmos isolados. Devem executar instantaneamente.
**Ferramentas:** Vitest
**Onde ficam:** Ao lado do arquivo de código (ex: `date.ts` -> `date.test.ts`).

### 2. Testes de Componentes (Vitest + React Testing Library)
Foco em testar os blocos visuais de forma isolada (`Button`, `Input`, `Dialog`).
Esses testes devem verificar se a UI interage corretamente com o usuário, foca estados (`disabled`, `loading`) e verifica acessibilidade via `jest-axe`.
**Onde ficam:** Na própria pasta do componente.

### 3. Testes de Integração (Vitest + MSW ou RTL na Página)
Foco nos fluxos que combinam múltiplos componentes, como formulários complexos (`Login`, `Cadastro`). Validam a ponte entre o `React Hook Form`, Zod e as chamadas simuladas de API.
**Onde ficam:** Em pastas como `src/app/...` (ex: `login.test.tsx`) ou na pasta `tests/integration/` no caso do Backend.

### 4. Testes End-to-End (Playwright)
Foco nos fluxos mais críticos de negócio (caminhos felizes principais, checkout de orçamentos, comunicação no chat). Utilizam navegadores reais em modo headless, simulando um usuário 100% autêntico desde o clique no menu inicial. Também cobrem os testes Responsivos e a navegação E2E de acessibilidade por teclado.
**Ferramentas:** Playwright.
**Onde ficam:** Pasta raiz `tests/e2e/`.

---

## Políticas de Merge e CI/CD
No futuro, todos os branches precisarão passar de forma verde no **Quality Gate** antes do merge:
- `npm run lint` limpo.
- Todos os testes Unitários e de Componentes passando com 100% de sucesso.
- Playwright Smoke Test passando para o caminho crítico.

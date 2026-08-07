# ROOT CAUSE ANALYSIS

## Incidentes Resolvidos
1. **Falha Crítica de Middleware e Proteção de Rotas**
   - **Sintoma:** O middleware do Next.js (`proxy.ts`) não estava sendo carregado pelo Next.js (pois estava nomeado incorretamente), deixando as rotas desprotegidas. Além disso, ele importava bibliotecas Node nativas (`node:crypto`) que causavam crash no ambiente Edge, falhando completamente as autenticações.
   - **Causa Raiz:** O Next.js requer a nomenclatura `middleware.ts`. Ao renomear para `middleware.ts`, o build quebrava devido ao uso da biblioteca `node:crypto` via dependências transitivas (`EdgeSessionDecoder` -> `index.ts` -> `crypto`).
   - **Solução:** Renomeado `proxy.ts` para `middleware.ts`. Ajustado os imports no `middleware.ts` para importar o `EdgeSessionDecoder` diretamente (evitando carregar os módulos Node nativos).

2. **Decodificação de Sessão Quebrada (Edge Runtime)**
   - **Sintoma:** Crash de `Buffer is not defined` no middleware.
   - **Causa Raiz:** O `EdgeSessionDecoder` usava `Buffer.from().toString('utf8')` para decodificar o Base64, porém `Buffer` não existe em ambientes Edge do Next.js.
   - **Solução:** Implementada uma solução baseada em APIs Web padrão (`atob` + `TextDecoder` + `Uint8Array`) e adicionado o preenchimento (padding) do Base64, evitando que a função `atob` retorne exceção `DOMException` por encodamento incorreto.

3. **Ausência da API de Sessão (Logout / Header)**
   - **Sintoma:** A navegação logada (Header e botões dinâmicos) não funcionava. Usuário não conseguia realizar logout por falta da sessão no cliente.
   - **Causa Raiz:** O Header da aplicação invocava `fetch("/api/auth/session")`, mas o arquivo `route.ts` dessa rota não existia.
   - **Solução:** Criado o endpoint `/api/auth/session` na pasta `src/app/api/auth/session/route.ts`, fornecendo ao cliente as informações de `role` e estado necessárias.

4. **Componentes Mockados Residuais**
   - **Sintoma:** O layout exibia "Perfil (Em Breve)", sujando a interface.
   - **Solução:** Removidos os componentes ilustrativos bloqueadores do Header.

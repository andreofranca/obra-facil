# Como Contribuir para o ObraFácil

Ficamos felizes com seu interesse em contribuir para o projeto! Nossa base foi fortificada pela iniciativa QEF (Quality Engineering Foundation) para garantir segurança e escalabilidade.

## Passo a Passo para Contribuições

1. **Faça um Fork e Clone o Repositório**
2. **Crie um Branch Descritivo**: (Ex: `feature/adicionar-pagamento-stripe`, `bugfix/correcao-mascara-telefone`)
3. **Padrões de Código**: 
   - Acompanhe o arquivo `docs/ENGINEERING_STANDARDS.md`.
   - Mantenha o Typescript restrito (`any` é banido).
   - Componentes visuais devem utilizar a *Platform Layer*.
4. **Testes**:
   - Todo PR precisa possuir cobertura de testes ou justificar a falta num ADR.
5. **Aprovação**:
   - Para que o PR seja aceito, o Quality Gate (`npm run lint`, `build`, `test`) deve passar no CI/CD.
   - Pelo menos um Code Review de um Mantenedor Oficial.

Agradecemos o seu tempo construindo código de qualidade!

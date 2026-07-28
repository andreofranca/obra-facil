# Processo de Lançamento (Release Process)

O ObraFácil adota um ciclo de release baseado em Semantic Versioning (SemVer) e Tags Git.

## Preparação da Release
1. Todo o código planejado para a release deve estar integrado na `main` via aprovação no Quality Gate.
2. A equipe executa os testes exploratórios no ambiente de Staging.
3. Débitos técnicos críticos impeditivos devem ser listados em `technical_debt.md` ou sanados.

## Criação da Versão
1. O mantenedor principal deve criar a Tag com a nomenclatura SemVer: `vMAJOR.MINOR.PATCH` (Ex: `v1.0.0`, ou `v0.25.0-beta`).
2. O arquivo `CHANGELOG.md` deve ser devidamente preenchido antes do commit que levará a tag.
3. Ao enviar a tag para o Github (`git push origin vX.X.X`), o pipeline `release.yml` será engatilhado automaticamente gerando a build isolada.

## Ambientes
- **Local**: Desenvolvimento na máquina do DEV.
- **Preview / PR**: Ambientes efêmeros criados a cada Pull Request (se integrado com Vercel/Netlify).
- **Staging / Beta**: Reflete a branch `main`.
- **Production**: Reflete as Tags.

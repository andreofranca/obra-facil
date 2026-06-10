# Decision Log

## Objetivo

Registrar as principais decisões arquiteturais, técnicas e de produto do ObraFácil.

---

# ADR-001

## Título

Definição do nome do produto

## Data

2026-06

## Decisão

O nome oficial do produto será:

ObraFácil

## Motivo

O nome comunica claramente:

* Construção
* Reforma
* Manutenção residencial

Possui fácil memorização e forte alinhamento com o público-alvo.

## Alternativas Avaliadas

* Mão na Massa
* Mãos à Obra
* SemProblemas

## Status

Aprovado

---

# ADR-002

## Título

Foco inicial do marketplace

## Data

2026-06

## Decisão

O MVP será focado exclusivamente em:

* Construção
* Reformas
* Manutenção residencial

## Motivo

Reduzir complexidade e validar o mercado antes de expandir para outras categorias.

## Não Inclui

* Diaristas
* Babás
* Cuidadores
* Serviços de informática
* Serviços automotivos

## Status

Aprovado

---

# ADR-003

## Título

Contato via WhatsApp

## Data

2026-06

## Decisão

O primeiro contato entre cliente e profissional ocorrerá através do WhatsApp.

## Motivo

* Menor custo de desenvolvimento
* Menor barreira para adoção
* Ferramenta já utilizada pelos usuários

## Alternativa Avaliada

Chat interno da plataforma.

## Motivo da Rejeição

Aumenta complexidade do MVP.

## Status

Aprovado

---

# ADR-004

## Título

Sem pagamentos no MVP

## Data

2026-06

## Decisão

Não haverá contratação nem pagamento pela plataforma no MVP.

## Motivo

O objetivo inicial é validar a geração de leads.

## Benefícios

* Menos risco
* Menor esforço de implementação
* Lançamento mais rápido

## Status

Aprovado

---

# ADR-005

## Título

Modelo de monetização

## Data

2026-06

## Decisão

Utilizar modelo Freemium.

### Gratuito

Perfil básico.

### Premium

Maior visibilidade e destaque.

## Motivo

Facilita aquisição inicial de profissionais.

## Status

Aprovado

---

# ADR-006

## Título

Arquitetura inicial

## Data

2026-06

## Decisão

Arquitetura Monolítica Modular.

## Stack

Frontend:

* Next.js
* React
* TypeScript

Backend:

* Next.js API Routes

Banco:

* PostgreSQL

ORM:

* Prisma

## Motivo

Velocidade de desenvolvimento e simplicidade operacional.

## Status

Aprovado

---

# ADR-007

## Título

Banco de dados

## Data

2026-06

## Decisão

Utilizar PostgreSQL.

## Motivo

* Open Source
* Confiável
* Escalável
* Excelente integração com Prisma

## Status

Aprovado

---

# ADR-008

## Título

Upload de imagens

## Data

2026-06

## Decisão

Utilizar Cloudinary.

## Motivo

* Simplicidade
* CDN global
* Redimensionamento automático
* Baixo custo inicial

## Status

Aprovado

---

# ADR-009

## Título

Metodologia de desenvolvimento

## Data

2026-06

## Decisão

Utilizar metodologia AI-First.

## Motivo

Aumentar produtividade e qualidade através de documentação estruturada.

## Princípios

* Contexto antes do código
* Documentação antes da implementação
* Regras antes das funcionalidades

## Status

Aprovado

---

# Próximas Decisões

As próximas ADRs deverão registrar:

* Estratégia SEO
* Aplicativo Mobile
* Assinaturas Premium
* Avaliações
* Geolocalização
* Pagamentos
* IA para recomendação de profissionais

---

# Regra

Nenhuma decisão relevante deve ser tomada sem registro neste documento.

Toda mudança arquitetural ou estratégica deve gerar uma nova ADR.

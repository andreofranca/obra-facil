# ADR 016: Estratégia de Performance

## Contexto
A experiência do usuário (UX) está atrelada ao tempo de carregamento da aplicação (Web Vitals).

## Decisão
Acompanhar ativamente as Core Web Vitals:
- LCP (Largest Contentful Paint) < 2.5s
- INP (Interaction to Next Paint) < 200ms
- CLS (Cumulative Layout Shift) < 0.1

Otimizações como Lazy Loading para páginas não-críticas, imagens otimizadas pelo `<Image />` do Next.js e minimização de JavaScript pesado no cliente (`"use client"`) tornam-se regra para novos desenvolvimentos.

## Consequências
Cuidado redobrado com bundle size. Importações de grandes bibliotecas deverão ser justificadas ou feitas via carregamento assíncrono (dynamic import).

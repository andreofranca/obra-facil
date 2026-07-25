# Design Decisions — UX.2.1

## Por que migramos para Design Tokens restritos?
No MVP técnico, muitas telas (como login, perfil) foram prototipadas às pressas com cores hardcoded e CSS esparso. A conversão e a confiança de um Marketplace de serviços (pessoas estranhas indo às casas de clientes) dependem da confiança que o layout emite. 
Consolidamos uma paleta Blue e Slate estrita (Apple / Stripe like) para estabilizar a mente do usuário.

## Por que abandonamos "Emojis" nativos?
As categorias e cartões no MVP usavam emojis brutos do SO (ex: 🧱, ⚡). Isso destrói a uniformidade e causa divergências enormes entre Android, Windows, e macOS, além de exalar aspecto não-comercial. Foi unificado e adotada a biblioteca de SVGs **Lucide React**, padronizando stroke, escala e suavidade vetorial.

## Por que 'DiceBear' para avatares estáticos?
Para demonstrar um layout autêntico enquanto o fluxo real de imagens de upload (S3/Cloudinary) não era concretizado na API. Optou-se por gerar avatares determinísticos baseados no charcode do nome do Profissional, o que evita bugs impuros (`Cannot call impure function during render`).

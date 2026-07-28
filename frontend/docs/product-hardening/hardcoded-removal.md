# Remoção de Hardcodes

Durante a etapa de Hardening, varremos a aplicação para remover valores mockados:
- Componente \`FeaturedProfessionals\`: Foi refatorado para utilizar limites paginados da API e mostrar cidades reais de \`profissional.endereco\`.
- Métricas Visuais Fakes: A falsa adição de estrelas para perfis sem avaliação foi substituída pela badge verdadeira "Novo na plataforma", alinhando-se aos princípios de transparência com o cliente.

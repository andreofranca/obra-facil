import { PrismaClient, UserRole, SolicitacaoStatus, PropostaStatus, PaymentStatus, TransferStatus } from '@prisma/client';
import { fakerPT_BR as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const MOCK_PASSWORD_HASH = 'senha123'; // legacy fallback

const STATES = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'DF'];
const CATEGORIES = [
  'Pedreiro', 'Pintor', 'Eletricista', 'Encanador', 'Marceneiro', 
  'Jardineiro', 'Gesseiro', 'Marido de Aluguel', 'Ladrilhador'
];

// Comentários variados para avaliações reais
const REVIEW_COMMENTS = [
  "Serviço excelente, muito caprichoso e pontual.",
  "Resolveu meu problema super rápido. Recomendo demais!",
  "Bom profissional, fez o que foi combinado.",
  "Preço justo e trabalho impecável. Com certeza chamarei novamente.",
  "Muito educado e deixou tudo limpo após terminar.",
  "Trabalho perfeito, melhor do que eu esperava.",
  "Atendimento nota 10. Chegou no horário e resolveu tudo.",
  "Tirou todas as minhas dúvidas e fez um serviço de primeira.",
  "Um pouco de atraso, mas o serviço compensou a espera.",
  "Sensacional. Acabamento perfeito e muito atencioso."
];

const CHAT_MESSAGES = [
  { p: "Olá! Vi sua solicitação. Posso te ajudar com isso.", c: "Que bom! Quando você poderia começar?" },
  { c: "Boa tarde, qual o valor médio para esse serviço?", p: "Boa tarde! O valor gira em torno de R$ 400. Posso enviar uma proposta formal." },
  { c: "Preciso que seja feito ainda essa semana, é possível?", p: "Sim, tenho agenda para quinta-feira. Fechado?" },
  { p: "Acabei de chegar no local.", c: "Perfeito, já estou descendo para abrir o portão." },
  { p: "Gostaria de agendar uma visita para orçar melhor.", c: "Claro, pode ser amanhã às 14h?" }
];

async function main() {
  console.log('🧹 [1/8] Limpando a base de dados (Idempotência)...');
  await prisma.transfer.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.favorito.deleteMany();
  await prisma.avaliacaoServico.deleteMany();
  await prisma.mensagemSolicitacao.deleteMany();
  await prisma.historicoStatusServico.deleteMany();
  await prisma.proposta.deleteMany();
  await prisma.solicitarServico.deleteMany();
  await prisma.servico.deleteMany();
  await prisma.endereco.deleteMany();
  await prisma.profissionalPlano.deleteMany();
  await prisma.profissional.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.categoriaServico.deleteMany();
  await prisma.plano.deleteMany();
  await prisma.user.deleteMany();

  console.log('🏷️ [2/8] Criando categorias...');
  const catMap = new Map<string, string>();
  for (const nome of CATEGORIES) {
    const cat = await prisma.categoriaServico.create({ data: { nome } });
    catMap.set(nome, cat.id);
  }

  console.log('👤 [3/8] Criando 20 clientes reais...');
  const clientes = [];
  for (let i = 0; i < 20; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: i === 0 ? 'cliente@demo.com' : faker.internet.email({ firstName, lastName }).toLowerCase(),
        phone: faker.phone.number({ style: 'national' }),
        password: MOCK_PASSWORD_HASH,
        role: UserRole.CLIENT,
        cliente: { create: {} }
      },
      include: { cliente: true }
    });
    if (user.cliente) clientes.push(user.cliente.id);
  }

  console.log('👷 [4/8] Criando 60 profissionais experientes...');
  const profissionais = [];
  for (let i = 0; i < 60; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const categoryName = CATEGORIES[i % CATEGORIES.length];
    
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: i === 0 ? 'profissional@demo.com' : faker.internet.email({ firstName, lastName }).toLowerCase(),
        phone: faker.phone.number({ style: 'national' }),
        password: MOCK_PASSWORD_HASH,
        role: UserRole.PROFESSIONAL,
        profissional: {
          create: {
            descricao: `Sou especialista em serviços de ${categoryName}. Tenho vasta experiência e busco sempre entregar o melhor acabamento com rapidez e honestidade.`,
            experiencia: faker.number.int({ min: 2, max: 25 }),
            ativo: true,
            fotoPerfil: `https://i.pravatar.cc/300?img=${i + 1}`,
            fotoCapa: `https://picsum.photos/seed/${i}/800/300`,
            obrasExecutadas: faker.number.int({ min: 10, max: 500 }),
            disponibilidade: faker.helpers.arrayElement(["Integral", "Seg a Sex", "Finais de Semana", "Imediata"]),
            whatsapp: faker.phone.number({ style: 'national' }),
            certificacoes: faker.helpers.arrayElements([
              "NR-10 (Segurança em Instalações)",
              "NR-35 (Trabalho em Altura)",
              "Curso SENAI Eletromecânica",
              "Certificação Especialista Suvinil",
              "Gestão de Obras SEBRAE",
              "Pintura Decorativa Tigre"
            ], faker.number.int({ min: 1, max: 3 })),
            galeria: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }).map((_, idx) => `https://picsum.photos/seed/${i}_${idx}/400/300`),
            endereco: {
              create: {
                cidade: faker.location.city(),
                estado: faker.helpers.arrayElement(STATES),
                cep: faker.location.zipCode('#####-###'),
                bairro: faker.location.streetAddress(),
                logradouro: faker.location.street(),
                numero: String(faker.number.int({ min: 1, max: 2000 }))
              }
            },
            servicos: {
              create: [
                {
                  titulo: `Especialista ${categoryName}`,
                  descricao: `Faço todo tipo de serviço relacionado a ${categoryName} com garantia de qualidade.`,
                  categoriaId: catMap.get(categoryName)!
                }
              ]
            }
          }
        }
      },
      include: { profissional: true }
    });
    if (user.profissional) profissionais.push(user.profissional.id);
  }

  console.log('⭐ [5/8] Criando Favoritos...');
  // Cada cliente favorita 2 a 3 profissionais aleatórios
  for (const clienteId of clientes) {
    const numFav = faker.number.int({ min: 1, max: 3 });
    const favs = faker.helpers.arrayElements(profissionais, numFav);
    for (const profId of favs) {
      await prisma.favorito.create({
        data: { clienteId, profissionalId: profId }
      });
    }
  }

  console.log('📝 [6/8] Criando 120 Solicitações, Propostas e Pagamentos...');
  // Distribuição: 30 ABERTA/PROPOSTAS, 30 EM_EXECUCAO, 40 CONCLUIDA, 10 CANCELADA, 10 AGUARDANDO_CONFIRMACAO
  const statuses = [
    ...Array(30).fill(SolicitacaoStatus.ABERTA),
    ...Array(30).fill(SolicitacaoStatus.EM_EXECUCAO),
    ...Array(40).fill(SolicitacaoStatus.CONCLUIDA),
    ...Array(10).fill(SolicitacaoStatus.CANCELADA),
    ...Array(10).fill(SolicitacaoStatus.AGUARDANDO_CONFIRMACAO)
  ];

  faker.helpers.shuffle(statuses);

  for (let i = 0; i < 120; i++) {
    const clienteId = faker.helpers.arrayElement(clientes);
    const status = statuses[i];
    
    // Serviços que passaram da fase de ABERTA tem um profissional escolhido
    const temProfissional = status !== SolicitacaoStatus.ABERTA;
    const profissionalId = temProfissional ? faker.helpers.arrayElement(profissionais) : null;
    
    const solicitacao = await prisma.solicitarServico.create({
      data: {
        titulo: `Preciso de serviço para ${faker.commerce.productAdjective()} residência`,
        descricao: `Gostaria de solicitar orçamento para um serviço rápido. ${faker.lorem.paragraph()}`,
        status,
        clienteId,
        profissionalId,
        createdAt: faker.date.recent({ days: 60 }),
        updatedAt: faker.date.recent({ days: 10 }),
        startedAt: [SolicitacaoStatus.EM_EXECUCAO, SolicitacaoStatus.CONCLUIDA].includes(status) ? faker.date.recent({ days: 30 }) : null,
        finishedAt: status === SolicitacaoStatus.CONCLUIDA ? faker.date.recent({ days: 5 }) : null
      }
    });

    // Criar Propostas
    const numPropostas = temProfissional ? faker.number.int({ min: 2, max: 4 }) : faker.number.int({ min: 1, max: 3 });
    let propostaAceitaId: string | null = null;
    let propostaAceitaValor: number = 0;

    for (let p = 0; p < numPropostas; p++) {
      const propProfId = (temProfissional && p === 0) ? profissionalId! : faker.helpers.arrayElement(profissionais);
      const propStatus = (temProfissional && p === 0) ? PropostaStatus.ACEITA : (temProfissional ? PropostaStatus.RECUSADA : PropostaStatus.PENDENTE);
      const valor = faker.number.float({ min: 150, max: 2000, fractionDigits: 2 });
      
      const proposta = await prisma.proposta.create({
        data: {
          valor,
          prazoDias: faker.number.int({ min: 1, max: 30 }),
          mensagem: `Olá, tenho interesse e disponibilidade para executar o serviço com muita qualidade. Orçamento de R$ ${valor.toFixed(2)}.`,
          status: propStatus,
          solicitacaoId: solicitacao.id,
          profissionalId: propProfId
        }
      });

      if (propStatus === PropostaStatus.ACEITA) {
        propostaAceitaId = proposta.id;
        propostaAceitaValor = valor;
      }
    }

    // Criar Chat
    if (temProfissional && profissionalId) {
      const chat = faker.helpers.arrayElement(CHAT_MESSAGES);
      const profUser = await prisma.profissional.findUnique({ where: { id: profissionalId }, select: { userId: true }});
      const cliUser = await prisma.cliente.findUnique({ where: { id: clienteId }, select: { userId: true }});
      
      if (profUser && cliUser) {
        await prisma.mensagemSolicitacao.create({ data: { solicitacaoId: solicitacao.id, usuarioId: cliUser.userId, mensagem: chat.c, createdAt: faker.date.recent({ days: 20 }) } });
        await prisma.mensagemSolicitacao.create({ data: { solicitacaoId: solicitacao.id, usuarioId: profUser.userId, mensagem: chat.p, createdAt: faker.date.recent({ days: 19 }) } });
      }
    }

    // Criar Pagamento Simulados para os aceitos
    if (propostaAceitaId && profissionalId) {
      const transactionStatus = status === SolicitacaoStatus.CONCLUIDA ? PaymentStatus.COMPLETED : PaymentStatus.AUTHORIZED;
      const transferStatus = status === SolicitacaoStatus.CONCLUIDA ? TransferStatus.COMPLETED : TransferStatus.PENDING;

      const tx = await prisma.transaction.create({
        data: {
          amount: propostaAceitaValor,
          currency: "BRL",
          status: transactionStatus,
          providerId: "mock_provider_stripe",
          referenceId: `req_${solicitacao.id}`,
          metadata: { propostaId: propostaAceitaId }
        }
      });

      // Taxa da plataforma de 10%
      const netAmount = Number((propostaAceitaValor * 0.9).toFixed(2));
      await prisma.transfer.create({
        data: {
          transactionId: tx.id,
          recipientId: profissionalId,
          amount: netAmount,
          status: transferStatus,
          providerId: "mock_provider_stripe_transfer"
        }
      });
    }

    // Criar Avaliações para serviços concluídos
    if (status === SolicitacaoStatus.CONCLUIDA && profissionalId) {
      await prisma.avaliacaoServico.create({
        data: {
          nota: faker.number.int({ min: 4, max: 5 }), 
          comentario: faker.helpers.arrayElement(REVIEW_COMMENTS),
          solicitacaoId: solicitacao.id,
          clienteId,
          profissionalId
        }
      });
    }
  }

  console.log('🚀 [7/8] Semeando concluído.');
  console.log('📊 [8/8] Resumo do Banco de Dados:');
  console.log(`- 20 Clientes`);
  console.log(`- 60 Profissionais`);
  console.log(`- 120 Solicitações de Serviço (com pagamentos e avaliações reais)`);
  console.log(`\n======================================================`);
  console.log(`Credenciais Oficiais de Demonstração (Senha: senha123)`);
  console.log(`Cliente Demo: cliente@demo.com`);
  console.log(`Profissional Demo: profissional@demo.com`);
  console.log(`======================================================\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

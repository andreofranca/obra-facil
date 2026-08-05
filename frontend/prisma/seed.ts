import { PrismaClient, UserRole, SolicitacaoStatus, PropostaStatus } from '@prisma/client';
import { fakerPT_BR as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o Seed de Homologação (Demo)...');

  // Limpar a base de dados
  console.log('Limpando dados antigos...');
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

  const MOCK_PASSWORD_HASH = '8127bb59fe214d2762cdff91bc691804:c1ebd465f2a24d7b635f05ff1c1d34c9a934ce8bf51b0291da27e0f230861ea651fff5be6a8de037fdb90cf674ced69fdf22d5aded3303500582ae5a387c8bb1'; // Representa "senha123"

  // 1. Criar Categorias de Serviço (25 categorias)
  console.log('Criando Categorias de Serviço...');
  const categoriasNomes = [
    'Encanador', 'Eletricista', 'Pedreiro', 'Pintor', 'Marceneiro',
    'Serralheiro', 'Vidraceiro', 'Gesseiro', 'Arquiteto', 'Engenheiro Civil',
    'Jardineiro', 'Piscineiro', 'Mestre de Obras', 'Calceiro', 'Impermeabilizador',
    'Climatização (Ar Condicionado)', 'Segurança Eletrônica', 'Instalador de Papel de Parede',
    'Montador de Móveis', 'Chaveiro', 'Encanador Industrial', 'Eletricista Predial',
    'Paisagista', 'Limpeza Pós-Obra', 'Demolidor'
  ];
  
  const categoriasIds: string[] = [];
  for (const nome of categoriasNomes) {
    const cat = await prisma.categoriaServico.create({
      data: { nome }
    });
    categoriasIds.push(cat.id);
  }

  // 2. Criar Clientes (30)
  console.log('Criando Clientes...');
  const clientesIds: string[] = [];
  for (let i = 0; i < 30; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number({ style: 'national' }),
        password: MOCK_PASSWORD_HASH,
        role: UserRole.CLIENT,
        cliente: {
          create: {}
        }
      },
      include: { cliente: true }
    });
    if (user.cliente) clientesIds.push(user.cliente.id);
  }

  // 3. Criar Profissionais (90)
  console.log('Criando Profissionais...');
  const profissionaisIds: string[] = [];
  for (let i = 0; i < 90; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().split('@')[0] + `+${faker.string.uuid()}@${faker.internet.email().split('@')[1]}`,
        phone: faker.phone.number({ style: 'national' }),
        password: MOCK_PASSWORD_HASH,
        role: UserRole.PROFESSIONAL,
        profissional: {
          create: {
            descricao: faker.lorem.paragraph(),
            experiencia: faker.number.int({ min: 1, max: 30 }),
            ativo: true,
            fotoPerfil: `https://i.pravatar.cc/150?u=${faker.string.uuid()}`,
            fotoCapa: faker.image.urlPicsumPhotos({ width: 1200, height: 400 }),
            galeria: Array.from({ length: 4 }).map(() => faker.image.urlPicsumPhotos({ width: 600, height: 400 })),
            certificacoes: ['NR-10', 'NR-35', 'Senai - Elétrica', 'Mestre de Obras'],
            obrasExecutadas: faker.number.int({ min: 10, max: 200 }),
            whatsapp: faker.phone.number({ style: 'international' }),
            disponibilidade: faker.helpers.arrayElement(['Imediata', 'Próxima semana', 'Apenas finais de semana']),
            endereco: {
              create: {
                cidade: faker.location.city(),
                estado: faker.location.state({ abbreviated: true }),
                cep: faker.location.zipCode('#####-###'),
                bairro: faker.location.streetAddress(),
                logradouro: faker.location.street(),
                numero: String(faker.number.int({ min: 1, max: 9999 }))
              }
            },
            servicos: {
              create: [
                {
                  titulo: `Serviço de ${faker.commerce.productName()}`,
                  descricao: faker.lorem.sentences(2),
                  categoriaId: faker.helpers.arrayElement(categoriasIds)
                }
              ]
            }
          }
        }
      },
      include: { profissional: true }
    });
    if (user.profissional) profissionaisIds.push(user.profissional.id);
  }

  // 4. Criar Solicitações de Serviço (150)
  console.log('Criando Solicitações de Serviço, Propostas e Avaliações...');
  for (let i = 0; i < 150; i++) {
    const clienteId = faker.helpers.arrayElement(clientesIds);
    // Simular que 70% das solicitações já têm um profissional atribuído
    const temProfissional = faker.number.int({ min: 1, max: 100 }) <= 70;
    const profissionalId = temProfissional ? faker.helpers.arrayElement(profissionaisIds) : null;
    
    // Se não tem profissional, o status costuma ser ABERTA. Se tem, pode ser qualquer outro.
    const status = temProfissional
      ? faker.helpers.arrayElement([SolicitacaoStatus.ACEITA, SolicitacaoStatus.EM_EXECUCAO, SolicitacaoStatus.CONCLUIDA])
      : SolicitacaoStatus.ABERTA;

    const solicitacao = await prisma.solicitarServico.create({
      data: {
        titulo: `Preciso de um profissional para ${faker.commerce.productAdjective()} obra`,
        descricao: faker.lorem.paragraph(),
        status,
        clienteId,
        profissionalId,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent()
      }
    });

    // 5. Criar Propostas para a solicitação (se aberta, 2 a 5 propostas. Se tem profissional, pelo menos a aceita)
    const numPropostas = temProfissional ? 1 : faker.number.int({ min: 0, max: 4 });
    for (let p = 0; p < numPropostas; p++) {
      const propProfId = temProfissional && p === 0 ? profissionalId! : faker.helpers.arrayElement(profissionaisIds);
      const propStatus = temProfissional && p === 0 ? PropostaStatus.ACEITA : PropostaStatus.PENDENTE;
      
      await prisma.proposta.create({
        data: {
          valor: faker.number.float({ min: 50, max: 5000, fractionDigits: 2 }),
          prazoDias: faker.number.int({ min: 1, max: 60 }),
          mensagem: faker.lorem.sentences(2),
          status: propStatus,
          solicitacaoId: solicitacao.id,
          profissionalId: propProfId
        }
      });
    }

    // 6. Criar Chat (Mensagens) para solicitações em andamento/concluídas
    if (temProfissional) {
      const numMensagens = faker.number.int({ min: 2, max: 10 });
      for (let m = 0; m < numMensagens; m++) {
        // Intercala autor entre cliente e profissional
        const autorId = (m % 2 === 0) 
          ? (await prisma.cliente.findUnique({ where: { id: clienteId } }))?.userId 
          : (await prisma.profissional.findUnique({ where: { id: profissionalId! } }))?.userId;

        if (autorId) {
          await prisma.mensagemSolicitacao.create({
            data: {
              mensagem: faker.lorem.sentence(),
              solicitacaoId: solicitacao.id,
              usuarioId: autorId
            }
          });
        }
      }
    }

    // 7. Criar Avaliação se a solicitação estiver CONCLUIDA
    if (status === SolicitacaoStatus.CONCLUIDA && profissionalId) {
      await prisma.avaliacaoServico.create({
        data: {
          nota: faker.number.int({ min: 3, max: 5 }), // Maioria notas boas
          comentario: faker.lorem.sentence(),
          solicitacaoId: solicitacao.id,
          clienteId,
          profissionalId
        }
      });
    }

    // 8. Criar Histórico de Status
    await prisma.historicoStatusServico.create({
      data: {
        solicitacaoId: solicitacao.id,
        usuarioId: (await prisma.cliente.findUnique({ where: { id: clienteId } }))!.userId,
        statusAnterior: null,
        novoStatus: status,
      }
    });
  }

  // 9. Criar Favoritos (5 a 10 favoritos por cliente)
  console.log('Criando Favoritos...');
  for (const clienteId of clientesIds) {
    const numFavoritos = faker.number.int({ min: 2, max: 8 });
    const profissionaisFavoritados = faker.helpers.arrayElements(profissionaisIds, numFavoritos);
    for (const profId of profissionaisFavoritados) {
      await prisma.favorito.upsert({
        where: {
          clienteId_profissionalId: {
            clienteId,
            profissionalId: profId
          }
        },
        create: {
          clienteId,
          profissionalId: profId
        },
        update: {}
      });
    }
  }

  console.log('✅ Seed finalizado com sucesso!');
  console.log(`- 25 Categorias`);
  console.log(`- 30 Clientes`);
  console.log(`- 90 Profissionais`);
  console.log(`- 150 Solicitações (com propostas, chat e avaliações)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
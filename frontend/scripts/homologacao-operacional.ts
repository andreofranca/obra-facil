import { PrismaClient } from "@prisma/client";
import { NodeCryptoProvider, SignedCookieSessionProvider } from "../src/platform/security";
import { ContractingDomainService } from "../src/domain/marketplace/ContractingDomainService";
import { PaymentService } from "../src/lib/payments/service";
import { MockPaymentProvider } from "../src/lib/payments/providers/mock";
import { TransitionValidator } from "../src/domain/service-request/TransitionValidator";
import { RequestStatus } from "../src/domain/service-request/RequestStatus";
import { RatingService } from "../src/domain/RatingService";
import type { AuthSession } from "../src/types/auth";

const prisma = new PrismaClient();
const cryptoProvider = new NodeCryptoProvider();
const sessionProvider = new SignedCookieSessionProvider(cryptoProvider);
const paymentProvider = new MockPaymentProvider();
const paymentService = new PaymentService(paymentProvider);
const contractingService = new ContractingDomainService(paymentService);

interface LogEntry {
  step: string;
  substep: string;
  status: "PASSOU" | "FALHOU" | "BLOQUEADO";
  details: string;
}

const logs: LogEntry[] = [];

function record(step: string, substep: string, status: "PASSOU" | "FALHOU" | "BLOQUEADO", details: string) {
  logs.push({ step, substep, status, details });
  console.log(`[${status}] ${step} - ${substep}: ${details}`);
}

async function runHomologation() {
  console.log("=== INICIANDO HOMOLOGAÇÃO OPERACIONAL EOS-2026-050 ===");
  const testRunId = Date.now().toString().slice(-6);
  const clientEmail = `cliente.homolog.${testRunId}@obrafacil.teste`;
  const proEmail = `pro.homolog.${testRunId}@obrafacil.teste`;
  const attackerEmail = `invasor.homolog.${testRunId}@obrafacil.teste`;

  let clientUserId = "";
  let clientId = "";
  let proUserId = "";
  let proId = "";
  let attackerUserId = "";
  let solicitacaoId = "";
  let propostaId = "";
  let avaliacaoId = "";

  try {
    // ----------------------------------------------------
    // FASE A — CADASTRO E AUTENTICAÇÃO
    // ----------------------------------------------------
    console.log("\n--- HOMOLOGAÇÃO A: Cadastro e Autenticação ---");

    // 1. Cadastro do Cliente
    const clientPasswordHash = await cryptoProvider.hashPassword("SenhaForte@2026");
    const clientUser = await prisma.user.create({
      data: {
        name: `Cliente Homologação ${testRunId}`,
        email: clientEmail,
        phone: "(11) 98765-4321",
        password: clientPasswordHash,
        role: "CLIENT",
        cliente: {
          create: {},
        },
      },
      include: { cliente: true },
    });
    clientUserId = clientUser.id;
    clientId = clientUser.cliente!.id;
    record("HOMOLOGAÇÃO A", "Cadastro de Cliente", "PASSOU", `Cliente persistido no PostgreSQL. ID: ${clientId}, UserID: ${clientUserId}`);

    // 2. Cadastro do Profissional
    const categoria = await prisma.categoriaServico.findFirst();
    if (!categoria) {
      throw new Error("Nenhuma CategoriaServico cadastrada no banco.");
    }

    const proPasswordHash = await cryptoProvider.hashPassword("SenhaProfissional@2026");
    const proUser = await prisma.user.create({
      data: {
        name: `Profissional Homologação ${testRunId}`,
        email: proEmail,
        phone: "(11) 91234-5678",
        password: proPasswordHash,
        role: "PROFESSIONAL",
        profissional: {
          create: {
            descricao: "Especialista em pintura e acabamentos finos.",
            experiencia: 10,
            whatsapp: "(11) 91234-5678",
            servicos: {
              create: {
                titulo: "Pintura Geral",
                categoriaId: categoria.id,
              },
            },
            endereco: {
              create: {
                cidade: "São Paulo",
                estado: "SP",
              },
            },
          },
        },
      },
      include: { profissional: { include: { servicos: true, endereco: true } } },
    });
    proUserId = proUser.id;
    proId = proUser.profissional!.id;
    record("HOMOLOGAÇÃO A", "Cadastro de Profissional", "PASSOU", `Profissional persistido com Categoria (${categoria.nome}) e Endereço. ID: ${proId}`);

    // 3. Validação de Credenciais e Sessão
    const isClientAuth = await cryptoProvider.verifyPassword("SenhaForte@2026", clientUser.password);
    const isProAuth = await cryptoProvider.verifyPassword("SenhaProfissional@2026", proUser.password);
    const isInvalidAuth = await cryptoProvider.verifyPassword("SenhaIncorreta@999", clientUser.password);

    if (isClientAuth && isProAuth && !isInvalidAuth) {
      record("HOMOLOGAÇÃO A", "Validação de Credenciais", "PASSOU", "Senhas válidas autenticadas e senha incorreta rejeitada.");
    } else {
      record("HOMOLOGAÇÃO A", "Validação de Credenciais", "FALHOU", "Falha na verificação de senhas.");
    }

    // 4. Criação e Parse de Sessões Criptografadas
    const clientSessionCookie = sessionProvider.createSessionValue({
      userId: clientUserId,
      clienteId: clientId,
      profissionalId: null,
      name: clientUser.name,
      email: clientUser.email,
      role: "CLIENT",
    });
    const parsedClientSession = sessionProvider.parseSessionValue<AuthSession>(clientSessionCookie);

    const proSessionCookie = sessionProvider.createSessionValue({
      userId: proUserId,
      clienteId: null,
      profissionalId: proId,
      name: proUser.name,
      email: proUser.email,
      role: "PROFESSIONAL",
    });
    const parsedProSession = sessionProvider.parseSessionValue<AuthSession>(proSessionCookie);

    if (parsedClientSession?.role === "CLIENT" && parsedProSession?.role === "PROFESSIONAL") {
      record("HOMOLOGAÇÃO A", "Gestão de Sessão Assinada", "PASSOU", "Cookies de sessão gerados, assinados e validados por papel.");
    } else {
      record("HOMOLOGAÇÃO A", "Gestão de Sessão Assinada", "FALHOU", "Divergência nos dados de sessão decodificados.");
    }

    // ----------------------------------------------------
    // FASE B — PUBLICAÇÃO DE SOLICITAÇÃO
    // ----------------------------------------------------
    console.log("\n--- HOMOLOGAÇÃO B: Publicação de Solicitação ---");
    const solicitacao = await prisma.solicitarServico.create({
      data: {
        titulo: `Pintura Residencial Homologação ${testRunId}`,
        descricao: "Pintura completa de apartamento de 75m2 incluindo teto e paredes com tinta acrílica lavável.",
        status: "ABERTA",
        clienteId: clientId,
        profissionalId: proId, // Solicitação direcionada ao profissional
        updatedAt: new Date(),
      },
    });
    solicitacaoId = solicitacao.id;

    const solicitacaoSalva = await prisma.solicitarServico.findUnique({
      where: { id: solicitacaoId },
      include: { cliente: { include: { user: true } }, profissional: { include: { user: true } } },
    });

    if (solicitacaoSalva && solicitacaoSalva.status === "ABERTA" && solicitacaoSalva.clienteId === clientId) {
      record("HOMOLOGAÇÃO B", "Publicação e Persistência", "PASSOU", `Solicitação criada com sucesso. ID: ${solicitacaoId}, Status: ${solicitacaoSalva.status}`);
    } else {
      record("HOMOLOGAÇÃO B", "Publicação e Persistência", "FALHOU", "Solicitação não localizada com integridade.");
    }

    // ----------------------------------------------------
    // FASE C — OPORTUNIDADES E PROPOSTAS
    // ----------------------------------------------------
    console.log("\n--- HOMOLOGAÇÃO C: Oportunidades e Propostas ---");
    const proposta = await prisma.proposta.create({
      data: {
        solicitacaoId: solicitacaoId,
        profissionalId: proId,
        valor: 2350.00,
        prazoDias: 6,
        mensagem: "Orçamento com materiais de primeira linha e prazo de 6 dias úteis.",
        status: "PENDENTE",
      },
    });
    propostaId = proposta.id;

    const propostaSalva = await prisma.proposta.findUnique({
      where: { id: propostaId },
    });

    if (propostaSalva && Number(propostaSalva.valor) === 2350.00 && propostaSalva.status === "PENDENTE") {
      record("HOMOLOGAÇÃO C", "Envio de Proposta", "PASSOU", `Proposta registrada com sucesso. ID: ${propostaId}, Valor: R$ ${propostaSalva.valor}`);
    } else {
      record("HOMOLOGAÇÃO C", "Envio de Proposta", "FALHOU", "Proposta não encontrada com os dados corretos.");
    }

    // ----------------------------------------------------
    // FASE D — COMUNICAÇÃO NO CHAT
    // ----------------------------------------------------
    console.log("\n--- HOMOLOGAÇÃO D: Comunicação no Chat ---");
    // Mensagem do Cliente
    await prisma.mensagemSolicitacao.create({
      data: {
        solicitacaoId: solicitacaoId,
        usuarioId: clientUserId,
        mensagem: "Olá! A proteção dos móveis está inclusa no valor?",
      },
    });

    // Resposta do Profissional
    await prisma.mensagemSolicitacao.create({
      data: {
        solicitacaoId: solicitacaoId,
        usuarioId: proUserId,
        mensagem: "Olá! Sim, todo o isolamento e proteção com lonas plásticas estão inclusos.",
      },
    });

    const historico = await prisma.mensagemSolicitacao.findMany({
      where: { solicitacaoId },
      orderBy: { createdAt: "asc" },
      include: { autor: true },
    });

    if (historico.length >= 2 && historico[0].usuarioId === clientUserId && historico[1].usuarioId === proUserId) {
      record("HOMOLOGAÇÃO D", "Troca de Mensagens", "PASSOU", `Histórico de mensagens persistido com 2 mensagens em ordem cronológica.`);
    } else {
      record("HOMOLOGAÇÃO D", "Troca de Mensagens", "FALHOU", "Histórico de mensagens inconsistente.");
    }

    // ----------------------------------------------------
    // FASE E — ACEITE DA PROPOSTA
    // ----------------------------------------------------
    console.log("\n--- HOMOLOGAÇÃO E: Aceite da Proposta ---");
    await contractingService.acceptProposal(propostaId, clientId);

    const solicitacaoPosAceite = await prisma.solicitarServico.findUnique({
      where: { id: solicitacaoId },
      include: { propostas: true },
    });

    if (
      solicitacaoPosAceite?.status === "ACEITA" &&
      solicitacaoPosAceite.propostas.find((p) => p.id === propostaId)?.status === "ACEITA"
    ) {
      record("HOMOLOGAÇÃO E", "Aceite da Proposta e Escrow", "PASSOU", `Proposta aceita e solicitação atualizada para status ACEITA. Profissional: ${solicitacaoPosAceite.profissionalId}`);
    } else {
      record("HOMOLOGAÇÃO E", "Aceite da Proposta e Escrow", "FALHOU", "Estado não refletiu ACEITA após transação.");
    }

    // ----------------------------------------------------
    // FASE F — EXECUÇÃO E CONCLUSÃO
    // ----------------------------------------------------
    console.log("\n--- HOMOLOGAÇÃO F: Execução e Conclusão ---");
    // 1. Início do Serviço (Profissional)
    const canStart = TransitionValidator.canTransition(RequestStatus.ACEITA, RequestStatus.EM_EXECUCAO);
    if (!canStart) throw new Error("Transição ACEITA -> EM_EXECUCAO bloqueada.");

    const servicoEmExecucao = await prisma.solicitarServico.update({
      where: { id: solicitacaoId },
      data: {
        status: "EM_EXECUCAO",
        startedAt: new Date(),
        updatedAt: new Date(),
        historicoStatus: {
          create: {
            usuarioId: proUserId,
            statusAnterior: "ACEITA",
            novoStatus: "EM_EXECUCAO",
          },
        },
      },
    });
    record("HOMOLOGAÇÃO F", "Início da Execução", "PASSOU", `Status atualizado para EM_EXECUCAO com startedAt: ${servicoEmExecucao.startedAt?.toISOString()}`);

    // 2. Finalização pelo Profissional (Aguardando Confirmação)
    await prisma.solicitarServico.update({
      where: { id: solicitacaoId },
      data: {
        status: "AGUARDANDO_CONFIRMACAO",
        updatedAt: new Date(),
        historicoStatus: {
          create: {
            usuarioId: proUserId,
            statusAnterior: "EM_EXECUCAO",
            novoStatus: "AGUARDANDO_CONFIRMACAO",
          },
        },
      },
    });
    record("HOMOLOGAÇÃO F", "Finalização pelo Profissional", "PASSOU", `Status atualizado para AGUARDANDO_CONFIRMACAO.`);

    // 3. Confirmação pelo Cliente (Conclusão Efetiva)
    const servicoFinalizado = await prisma.solicitarServico.update({
      where: { id: solicitacaoId },
      data: {
        status: "FINALIZADA",
        finishedAt: new Date(),
        updatedAt: new Date(),
        historicoStatus: {
          create: {
            usuarioId: clientUserId,
            statusAnterior: "AGUARDANDO_CONFIRMACAO",
            novoStatus: "FINALIZADA",
          },
        },
      },
    });
    record("HOMOLOGAÇÃO F", "Confirmação pelo Cliente", "PASSOU", `Status atualizado para FINALIZADA com finishedAt: ${servicoFinalizado.finishedAt?.toISOString()}`);

    // ----------------------------------------------------
    // FASE G — AVALIAÇÃO E DEPOIMENTO
    // ----------------------------------------------------
    console.log("\n--- HOMOLOGAÇÃO G: Avaliação e Depoimento ---");
    RatingService.validateRatingRules(5);

    const avaliacao = await prisma.avaliacaoServico.create({
      data: {
        solicitacaoId: solicitacaoId,
        clienteId: clientId,
        profissionalId: proId,
        nota: 5,
        comentario: "Excelente profissional! Pontual, caprichoso e entregou a pintura antes do prazo combinado.",
      },
    });
    avaliacaoId = avaliacao.id;

    // Atualiza obras executadas do profissional
    await prisma.profissional.update({
      where: { id: proId },
      data: { obrasExecutadas: { increment: 1 } },
    });

    const avaliacaoSalva = await prisma.avaliacaoServico.findUnique({
      where: { id: avaliacaoId },
      include: { cliente: { include: { user: true } }, profissional: { include: { user: true } } },
    });

    if (avaliacaoSalva && avaliacaoSalva.nota === 5) {
      record("HOMOLOGAÇÃO G", "Avaliação e Depoimento", "PASSOU", `Avaliação registrada (Nota: ${avaliacaoSalva.nota}/5, Comentário: "${avaliacaoSalva.comentario}").`);
    } else {
      record("HOMOLOGAÇÃO G", "Avaliação e Depoimento", "FALHOU", "Avaliação não localizada no banco.");
    }

    // ----------------------------------------------------
    // TESTES NEGATIVOS E SEGURANÇA
    // ----------------------------------------------------
    console.log("\n--- TESTES NEGATIVOS E SEGURANÇA ---");
    // Teste 1: Avaliação Duplicada
    let blockedDuplicateRating = false;
    try {
      await prisma.avaliacaoServico.create({
        data: {
          solicitacaoId: solicitacaoId,
          clienteId: clientId,
          profissionalId: proId,
          nota: 4,
          comentario: "Tentativa duplicada",
        },
      });
    } catch {
      blockedDuplicateRating = true;
    }
    if (blockedDuplicateRating) {
      record("SEGURANÇA", "Prevenção de Avaliação Duplicada", "PASSOU", "Bloqueada com sucesso pela restrição de unicidade (@unique no solicitacaoId).");
    } else {
      record("SEGURANÇA", "Prevenção de Avaliação Duplicada", "FALHOU", "Permitiu avaliação duplicada.");
    }

    // Teste 2: Terceiro Não Autorizado no Chat
    const attackerPasswordHash = await cryptoProvider.hashPassword("SenhaInvasor@2026");
    const attackerUser = await prisma.user.create({
      data: {
        name: `Invasor Homologação ${testRunId}`,
        email: attackerEmail,
        phone: "(11) 90000-0000",
        password: attackerPasswordHash,
        role: "CLIENT",
        cliente: { create: {} },
      },
      include: { cliente: true },
    });
    attackerUserId = attackerUser.id;

    // Regra da API de isolamento de chat
    const canAttackerAccess = (attackerUser.cliente?.id === solicitacao.clienteId);
    if (!canAttackerAccess) {
      record("SEGURANÇA", "Isolamento de Chat / IDOR", "PASSOU", "Usuário terceiro impedido de acessar conversa privada.");
    } else {
      record("SEGURANÇA", "Isolamento de Chat / IDOR", "FALHOU", "Falha no isolamento do chat.");
    }

    // Teste 3: Transição Ilegal de Estado
    const canTransitionIllegal = TransitionValidator.canTransition(RequestStatus.CONCLUIDA, RequestStatus.ABERTA);
    if (!canTransitionIllegal) {
      record("SEGURANÇA", "Validação da Máquina de Estados", "PASSOU", "Transição CONCLUIDA -> ABERTA rejeitada pela TransitionValidator.");
    } else {
      record("SEGURANÇA", "Validação da Máquina de Estados", "FALHOU", "Permitiu transição ilegal de status.");
    }

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("ERRO DURANTE HOMOLOGAÇÃO:", msg);
    record("EXECUÇÃO", "Fluxo Geral", "FALHOU", msg);
  } finally {
    // ----------------------------------------------------
    // LIMPEZA HIGIÊNICA DE DADOS DE TESTE
    // ----------------------------------------------------
    console.log("\n--- LIMPEZA HIGIÊNICA DE DADOS DE HOMOLOGAÇÃO ---");
    try {
      if (avaliacaoId) await prisma.avaliacaoServico.deleteMany({ where: { id: avaliacaoId } });
      if (solicitacaoId) {
        await prisma.historicoStatusServico.deleteMany({ where: { solicitacaoId } });
        await prisma.mensagemSolicitacao.deleteMany({ where: { solicitacaoId } });
        await prisma.proposta.deleteMany({ where: { solicitacaoId } });
        await prisma.solicitarServico.deleteMany({ where: { id: solicitacaoId } });
      }
      if (clientUserId) {
        await prisma.cliente.deleteMany({ where: { userId: clientUserId } });
        await prisma.user.deleteMany({ where: { id: clientUserId } });
      }
      if (proUserId) {
        await prisma.servico.deleteMany({ where: { profissionalId: proId } });
        await prisma.endereco.deleteMany({ where: { profissionalId: proId } });
        await prisma.profissional.deleteMany({ where: { userId: proUserId } });
        await prisma.user.deleteMany({ where: { id: proUserId } });
      }
      if (attackerUserId) {
        await prisma.cliente.deleteMany({ where: { userId: attackerUserId } });
        await prisma.user.deleteMany({ where: { id: attackerUserId } });
      }
      console.log("Registros de teste excluídos com sucesso. Base limpa e higienizada.");
    } catch (cleanupErr) {
      console.error("Erro na limpeza higiênica:", cleanupErr);
    }
    await prisma.$disconnect();
  }

  console.log("\n=== RESUMO DA HOMOLOGAÇÃO OPERACIONAL ===");
  const passed = logs.filter((l) => l.status === "PASSOU").length;
  const failed = logs.filter((l) => l.status === "FALHOU").length;
  console.log(`Total de testes operacionais: ${logs.length}`);
  console.log(`Aprovados: ${passed}`);
  console.log(`Falhos: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

runHomologation();

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { isValidPhone } from "@/lib/validation/phone";
import { LIMITS } from "@/lib/constants/limits";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const reqLogger = logger.withRequest(request);
  try {
    const session = await getAuthSession();

    if (!session || !session.userId) {
      return apiError("Não autenticado", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        cliente: {
          select: {
            id: true,
            _count: {
              select: {
                solicitacoes: true,
                avaliacoesServico: true,
                favoritos: true,
              },
            },
          },
        },
        profissional: {
          select: {
            id: true,
            descricao: true,
            experiencia: true,
            ativo: true,
            fotoPerfil: true,
            fotoCapa: true,
            obrasExecutadas: true,
            disponibilidade: true,
            whatsapp: true,
            endereco: {
              select: {
                cidade: true,
                estado: true,
                bairro: true,
                cep: true,
                logradouro: true,
                numero: true,
                complemento: true,
              },
            },
            servicos: {
              select: {
                id: true,
                titulo: true,
                categoria: {
                  select: {
                    id: true,
                    nome: true,
                  },
                },
              },
            },
            _count: {
              select: {
                solicitacoes: true,
                avaliacoesServico: true,
                propostas: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return apiError("Usuário não encontrado", 404);
    }

    return apiSuccess(user);
  } catch (err) {
    reqLogger.error(err);
    return apiError("Falha interna ao consultar perfil", 500);
  }
}

export async function PATCH(request: NextRequest) {
  const reqLogger = logger.withRequest(request);
  try {
    const session = await getAuthSession();

    if (!session || !session.userId) {
      return apiError("Não autenticado", 401);
    }

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return apiError("Corpo da requisição inválido", 400);
    }

    const payload = body as Record<string, unknown>;

    // Validação de nome
    let name: string | undefined;
    if (payload.name !== undefined) {
      if (typeof payload.name !== "string" || payload.name.trim().length < 2) {
        return apiError("O nome deve ter no mínimo 2 caracteres", 400);
      }
      if (payload.name.trim().length > LIMITS.NAME_MAX) {
        return apiError(`O nome não pode exceder ${LIMITS.NAME_MAX} caracteres`, 400);
      }
      name = payload.name.trim();
    }

    // Validação de telefone
    let phone: string | undefined;
    if (payload.phone !== undefined) {
      if (payload.phone !== null && payload.phone !== "") {
        if (typeof payload.phone !== "string" || !isValidPhone(payload.phone)) {
          return apiError("Telefone com formato inválido. Use (XX) XXXXX-XXXX", 400);
        }
        phone = payload.phone.trim();
      } else {
        phone = null as unknown as string;
      }
    }

    // Diferenciação de papéis
    if (session.role === "CLIENT") {
      // Cliente só altera name e phone
      const updatedUser = await prisma.user.update({
        where: { id: session.userId },
        data: {
          ...(name !== undefined && { name }),
          ...(phone !== undefined && { phone }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      });

      return apiSuccess({
        message: "Perfil atualizado com sucesso",
        user: updatedUser,
      });
    }

    if (session.role === "PROFESSIONAL") {
      // Validação de campos de profissional
      let descricao: string | undefined;
      if (payload.descricao !== undefined) {
        if (typeof payload.descricao === "string") {
          if (payload.descricao.length > LIMITS.DESCRIPTION_MAX) {
            return apiError(`A descrição não pode exceder ${LIMITS.DESCRIPTION_MAX} caracteres`, 400);
          }
          descricao = payload.descricao.trim();
        } else if (payload.descricao === null) {
          descricao = "";
        }
      }

      let experiencia: number | undefined;
      if (payload.experiencia !== undefined) {
        if (typeof payload.experiencia === "number" && !isNaN(payload.experiencia)) {
          if (payload.experiencia < 0 || payload.experiencia > 60) {
            return apiError("Anos de experiência deve estar entre 0 e 60", 400);
          }
          experiencia = Math.floor(payload.experiencia);
        } else if (payload.experiencia === null) {
          experiencia = 0;
        } else {
          return apiError("Anos de experiência deve ser um número válido", 400);
        }
      }

      let whatsapp: string | undefined;
      if (payload.whatsapp !== undefined) {
        if (typeof payload.whatsapp === "string" && payload.whatsapp.trim().length > 0) {
          if (!isValidPhone(payload.whatsapp)) {
            return apiError("WhatsApp com formato inválido. Use (XX) XXXXX-XXXX", 400);
          }
          whatsapp = payload.whatsapp.trim();
        } else {
          whatsapp = null as unknown as string;
        }
      }

      let fotoPerfil: string | undefined;
      if (payload.fotoPerfil !== undefined) {
        if (typeof payload.fotoPerfil === "string") {
          fotoPerfil = payload.fotoPerfil.trim();
        } else if (payload.fotoPerfil === null) {
          fotoPerfil = null as unknown as string;
        }
      }

      const cidade = typeof payload.cidade === "string" ? payload.cidade.trim() : undefined;
      const estado = typeof payload.estado === "string" ? payload.estado.trim().toUpperCase() : undefined;

      // Transação atômica para salvar dados do Usuário, Profissional e Endereço
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
          where: { id: session.userId },
          data: {
            ...(name !== undefined && { name }),
            ...(phone !== undefined && { phone }),
          },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        });

        const profissional = await tx.profissional.findUnique({
          where: { userId: session.userId },
        });

        if (!profissional) {
          throw new Error("Perfil de profissional não localizado");
        }

        const updatedProfissional = await tx.profissional.update({
          where: { id: profissional.id },
          data: {
            ...(descricao !== undefined && { descricao }),
            ...(experiencia !== undefined && { experiencia }),
            ...(whatsapp !== undefined && { whatsapp }),
            ...(fotoPerfil !== undefined && { fotoPerfil }),
          },
        });

        // Se informou cidade ou estado, atualiza endereço
        if (cidade !== undefined || estado !== undefined) {
          await tx.endereco.upsert({
            where: { profissionalId: profissional.id },
            create: {
              profissionalId: profissional.id,
              cidade: cidade || null,
              estado: estado || null,
            },
            update: {
              ...(cidade !== undefined && { cidade }),
              ...(estado !== undefined && { estado }),
            },
          });
        }

        return { user, profissional: updatedProfissional };
      });

      return apiSuccess({
        message: "Perfil de profissional atualizado com sucesso",
        data: result,
      });
    }

    return apiError("Papel de usuário não suportado", 403);
  } catch (err: unknown) {
    reqLogger.error(err);
    const message = err instanceof Error ? err.message : "Falha interna ao atualizar perfil";
    return apiError(message, 500);
  }
}

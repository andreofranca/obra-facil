import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, hashPassword, verifyPassword } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { isValidPassword } from "@/lib/validation/password";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
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

    const { currentPassword, newPassword, confirmPassword } = body as Record<string, unknown>;

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string" ||
      currentPassword.trim() === "" ||
      newPassword.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      return apiError("Todos os campos de senha são obrigatórios", 400);
    }

    if (newPassword !== confirmPassword) {
      return apiError("A nova senha e a confirmação não coincidem", 400);
    }

    if (!isValidPassword(newPassword)) {
      return apiError(
        "A nova senha não atende aos requisitos de segurança (mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial)",
        400
      );
    }

    if (currentPassword === newPassword) {
      return apiError("A nova senha deve ser diferente da senha atual", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, password: true },
    });

    if (!user) {
      return apiError("Usuário não encontrado", 404);
    }

    const isCurrentValid = await verifyPassword(currentPassword, user.password);
    if (!isCurrentValid) {
      return apiError("A senha atual informada está incorreta", 400);
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return apiSuccess({
      message: "Senha alterada com sucesso",
    });
  } catch (err: unknown) {
    reqLogger.error(err);
    const message = err instanceof Error ? err.message : "Falha interna ao alterar senha";
    return apiError(message, 500);
  }
}

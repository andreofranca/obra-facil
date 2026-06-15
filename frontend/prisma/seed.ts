import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categorias = await prisma.categoriaServico.findMany();

  for (const categoria of categorias) {
    const nome = categoria.nome;

    const usuario = await prisma.user.create({
      data: {
        name: `${nome} Profissional`,
        email: `${nome.toLowerCase()}@obrafacil.com`,
        password: "123456",
        role: "PROFESSIONAL",
      },
    });

    const profissional = await prisma.profissional.create({
      data: {
        userId: usuario.id,
        descricao: `${nome} com experiência`,
        experiencia: 5,
      },
    });

    await prisma.servico.create({
      data: {
        titulo: `Serviço de ${nome}`,
        descricao: `Prestação de serviços de ${nome}`,
        categoriaId: categoria.id,
        profissionalId: profissional.id,
      },
    });
  }

  console.log("Seed completa executada!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categoriasDefault = ["Pedreiro", "Encanador", "Eletricista", "Pintor"];
  for (const nome of categoriasDefault) {
    await prisma.categoriaServico.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  const categorias = await prisma.categoriaServico.findMany();

  for (const categoria of categorias) {
    const nome = categoria.nome;

    const email = `${nome.toLowerCase()}@obrafacil.com`;
    let usuario = await prisma.user.findUnique({ where: { email } });
    if (!usuario) {
      usuario = await prisma.user.create({
        data: {
          name: `${nome} Profissional`,
          email,
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
  }

  let clienteUser = await prisma.user.findUnique({ where: { email: "cliente@obrafacil.com" } });
  if (!clienteUser) {
    clienteUser = await prisma.user.create({
      data: {
        name: "Cliente Teste",
        email: "cliente@obrafacil.com",
        password: "123456",
        role: "CLIENT",
      },
    });
    await prisma.cliente.create({
      data: { userId: clienteUser.id }
    });
  }

  console.log("Seed completa executada!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
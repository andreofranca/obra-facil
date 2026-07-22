import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.categoriaServico.findMany();
  console.log("Categories:", categories);
  
  const professionals = await prisma.profissional.findMany({
    include: { user: true, avaliacoes: true, servicos: { include: { categoria: true } } }
  });
  console.log("Professionals count:", professionals.length);
  if (professionals.length > 0) {
    console.log("Sample:", JSON.stringify(professionals[0], null, 2));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

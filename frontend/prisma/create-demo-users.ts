import { PrismaClient } from '@prisma/client'; 
const prisma = new PrismaClient(); 

async function createTestUsers() { 
  const hash = '8127bb59fe214d2762cdff91bc691804:c1ebd465f2a24d7b635f05ff1c1d34c9a934ce8bf51b0291da27e0f230861ea651fff5be6a8de037fdb90cf674ced69fdf22d5aded3303500582ae5a387c8bb1'; 
  
  await prisma.user.create({ 
    data: { 
      email: 'cliente@pmo.com', 
      name: 'Cliente PMO', 
      password: hash, 
      role: 'CLIENT', 
      cliente: { create: {} } 
    } 
  }); 
  
  await prisma.user.create({ 
    data: { 
      email: 'profissional@pmo.com', 
      name: 'Profissional PMO', 
      password: hash, 
      role: 'PROFESSIONAL', 
      profissional: { 
        create: { 
          descricao: 'Profissional de Demonstração, pronto para transformar sua obra!', 
          experiencia: 10, 
          ativo: true, 
          fotoPerfil: 'https://i.pravatar.cc/150?u=pmo', 
          fotoCapa: 'https://picsum.photos/seed/pmo/1200/400', 
          galeria: ['https://picsum.photos/seed/g1/600/400', 'https://picsum.photos/seed/g2/600/400'], 
          certificacoes: ['Certificado PMO', 'NR-10', 'Excelência'], 
          obrasExecutadas: 50, 
          whatsapp: '11999999999', 
          disponibilidade: 'Imediata', 
          servicos: { 
            create: [{ 
              titulo: 'Serviço Premium PMO', 
              descricao: 'Demonstração de alta qualidade para o Marketplace', 
              categoriaId: (await prisma.categoriaServico.findFirst())?.id || '' 
            }] 
          } 
        } 
      } 
    } 
  }); 
  
  console.log('Test users created!'); 
} 

createTestUsers().catch(console.error).finally(()=>prisma.$disconnect());

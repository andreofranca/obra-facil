import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import type {
  PropostaResumo,
  PropostaStatus,
} from "@/types/proposta";
import PropostaItem from "@/components/propostas/PropostaItem";

const prisma = new PrismaClient();

// PropostaItem lida com exibição e ações no cliente

function mapProposta(proposta: {
  id: string;
  valor: { toString: () => string };
  prazoDias: number;
  mensagem: string;
  status: PropostaStatus;
  createdAt: Date;
  updatedAt: Date;
  solicitacao: {
    id: string;
    titulo: string;
    descricao: string;
    cliente: {
      id: string;
      user: {
        name: string;
        email: string;
      };
    };
  };
  profissional: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
}): PropostaResumo {
  return {
    id: proposta.id,
    valor: proposta.valor.toString(),
    prazoDias: proposta.prazoDias,
    mensagem: proposta.mensagem,
    status: proposta.status,
    createdAt: proposta.createdAt.toISOString(),
    updatedAt: proposta.updatedAt.toISOString(),
    solicitacao: {
      id: proposta.solicitacao.id,
      titulo: proposta.solicitacao.titulo,
      descricao: proposta.solicitacao.descricao,
      cliente: {
        id: proposta.solicitacao.cliente.id,
        nome: proposta.solicitacao.cliente.user.name,
        email: proposta.solicitacao.cliente.user.email,
      },
    },
    profissional: {
      id: proposta.profissional.id,
      nome: proposta.profissional.user.name,
      email: proposta.profissional.user.email,
    },
  };
}

export default async function MinhasPropostasPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "CLIENT" || !session.clienteId) {
    redirect("/meus-pedidos");
  }

  const propostas = await prisma.proposta.findMany({
    where: {
      solicitacao: {
        clienteId: session.clienteId,
      },
    },
    include: {
      solicitacao: {
        include: {
          cliente: {
            include: {
              user: true,
            },
          },
        },
      },
      profissional: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const propostasResumo = propostas.map(mapProposta);

  return (
    <main className="p-10">
      <div className="max-w-5xl">
        <h1 className="text-4xl font-bold mb-6">
          Minhas Propostas
        </h1>

        {propostasResumo.length === 0 ? (
          <div className="border rounded-lg p-6 shadow">
            <p>
              Nenhuma proposta recebida para suas solicitações.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {propostasResumo.map((proposta) => (
              <div key={proposta.id}>
                {/* Use PropostaItem client component for actions */}
                <PropostaItem proposta={proposta} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

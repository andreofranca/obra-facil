import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import type {
  PropostaResumo,
  PropostaStatus,
} from "@/types/proposta";

const prisma = new PrismaClient();

const statusLabels: Record<PropostaStatus, string> = {
  PENDENTE: "Pendente",
  ACEITA: "Aceita",
  RECUSADA: "Recusada",
};

const statusClasses: Record<PropostaStatus, string> = {
  PENDENTE: "bg-yellow-100 text-yellow-800",
  ACEITA: "bg-emerald-100 text-emerald-700",
  RECUSADA: "bg-red-100 text-red-700",
};

function formatCurrency(value: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

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
              <article
                key={proposta.id}
                className="border rounded-lg p-5 shadow"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {proposta.solicitacao.titulo}
                    </h2>
                    <p className="mt-2 text-sm opacity-80">
                      Profissional: {proposta.profissional.nome}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[proposta.status]}`}
                  >
                    {statusLabels[proposta.status]}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <p>
                    <strong>Valor:</strong>{" "}
                    {formatCurrency(proposta.valor)}
                  </p>
                  <p>
                    <strong>Prazo:</strong>{" "}
                    {proposta.prazoDias} dias
                  </p>
                </div>

                <p className="mt-4">
                  <strong>Mensagem:</strong>
                  <br />
                  {proposta.mensagem}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

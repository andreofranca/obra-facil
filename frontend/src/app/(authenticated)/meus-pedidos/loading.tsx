import { OrdersSkeleton } from "@/components/pedidos/OrdersSkeleton";

export default function LoadingMeusPedidos() {
  return (
    <main className="p-4 sm:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-6 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Meus Pedidos
        </h1>
        <p className="text-white/70 max-w-2xl">
          Acompanhe o andamento das suas solicitações de serviço.
        </p>
      </div>
      <OrdersSkeleton />
    </main>
  );
}

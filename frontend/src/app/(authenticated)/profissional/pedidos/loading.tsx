import { DashboardSkeleton } from "@/components/profissional-dashboard";

export default function LoadingProfissionalPedidos() {
  return (
    <main className="bg-transparent min-h-screen pt-4 pb-10">
      <DashboardSkeleton />
    </main>
  );
}

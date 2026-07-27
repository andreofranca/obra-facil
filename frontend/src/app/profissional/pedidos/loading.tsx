import { DashboardSkeleton } from "@/components/profissional-dashboard";

export default function LoadingProfissionalPedidos() {
  return (
    <main className="bg-neutral-background min-h-screen pt-4 pb-10">
      <DashboardSkeleton />
    </main>
  );
}

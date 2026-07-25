import { Header, Footer } from "@/components/layout";
import { ProfessionalSkeleton } from "@/components/profissional";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-background font-sans">
      <Header />
      <main className="flex-1 w-full">
        <ProfessionalSkeleton />
      </main>
      <Footer />
    </div>
  );
}

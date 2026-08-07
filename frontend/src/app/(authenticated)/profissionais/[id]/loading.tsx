import { ProfessionalSkeleton } from "@/components/profissional";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent font-sans">
            <main className="flex-1 w-full">
        <ProfessionalSkeleton />
      </main>
          </div>
  );
}

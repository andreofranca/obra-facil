import {
  CTA,
  CategoryGrid,
  FeaturedProfessionals,
  Hero,
  HowItWorks,
} from "@/components/home";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Hero />
      <CategoryGrid />
      <FeaturedProfessionals />
      <HowItWorks />
      <CTA />
    </div>
  );
}

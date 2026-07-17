import {
  CTA,
  CategoryGrid,
  FeaturedProfessionals,
  Hero,
  HowItWorks,
} from "@/components/home";
import { AppLayout } from "@/components/layout";

export default function Home() {
  return (
    <AppLayout contentSize="xl">
      <Hero />
      <CategoryGrid />
      <FeaturedProfessionals />
      <HowItWorks />
      <CTA />
    </AppLayout>
  );
}

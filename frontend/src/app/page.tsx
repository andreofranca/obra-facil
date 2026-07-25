import {
  CTA,
  CategoryGrid,
  FeaturedProfessionals,
  Hero,
  HowItWorks,
} from "@/components/home";
import { AppLayout, Header, Footer } from "@/components/layout";

export default function Home() {
  return (
    <AppLayout 
      contentSize="xl"
      navigation={<Header />}
      footer={<Footer />}
    >
      <Hero />
      <CategoryGrid />
      <FeaturedProfessionals />
      <HowItWorks />
      <CTA />
    </AppLayout>
  );
}

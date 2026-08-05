/* eslint-disable */
import { Metadata } from "next";
import React from 'react';
import Link from 'next/link';
import '../vitrine.css';
import { FavoriteButton } from "@/components/profissional/FavoriteButton";

// Mock data fetcher function
const getProfessional = (id: string) => {
  const professionals = {
    '1': {
      id: '1',
      name: 'João Silva',
      specialty: 'Eletricista Residencial e Predial',
      rating: 4.9,
      reviews: 128,
      experience: '10 anos',
      city: 'São Paulo, SP',
      price: 'R$ 150/visita',
      availability: 'Disponível hoje',
      coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop',
      profileImage: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=1965&auto=format&fit=crop',
      about: 'Especialista em instalações elétricas residenciais e prediais. Três certificações NR10 e ampla experiência em projetos de automação residencial.',
      gallery: [
        { type: 'Antes', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop' },
        { type: 'Depois', url: 'https://images.unsplash.com/photo-1558227691-41ea78d1f631?q=80&w=1974&auto=format&fit=crop' },
        { type: 'Obra Executada', url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop' },
      ]
    },
    '2': {
      id: '2',
      name: 'Maria Fernandes',
      specialty: 'Arquiteta e Designer de Interiores',
      rating: 5.0,
      reviews: 89,
      experience: '8 anos',
      city: 'Rio de Janeiro, RJ',
      price: 'R$ 200/h',
      availability: 'Agenda aberta',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
      profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
      about: 'Arquiteta apaixonada por criar espaços funcionais e estéticos que melhoram a qualidade de vida. Projetos residenciais e comerciais com foco em sustentabilidade.',
      gallery: [
        { type: 'Antes', url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2070&auto=format&fit=crop' },
        { type: 'Depois', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop' },
        { type: 'Obra Executada', url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2069&auto=format&fit=crop' },
      ]
    }
  };
  // @ts-ignore
  return professionals[id] || professionals['1'];
};

export default function ProfessionalProfile({ params }: { params: { id: string } }) {
  const prof = getProfessional(params.id);

  return (
    <div className="marketplace-container">
      <Link href="/profissionais" style={{ color: '#a5b4fc', textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>
        ← Voltar para Vitrine
      </Link>
      
      <div className="profile-container glass-panel">
        <div className="profile-header">
          <div className="profile-cover" style={{ backgroundImage: `url(${prof.coverImage})` }}>
             <div className="availability-badge" style={{ top: '20px', right: '20px', fontSize: '1rem' }}>
                {prof.availability}
             </div>
          </div>
          
          <div className="profile-header-content">
            <img src={prof.profileImage} alt={prof.name} className="profile-avatar" />
            
            <div className="profile-main-info">
              <h1>{prof.name}</h1>
              <p className="specialty" style={{ fontSize: '1.1rem' }}>{prof.specialty}</p>
              
              <div className="stats-row" style={{ border: 'none', padding: 0, justifyContent: 'flex-start', gap: '2rem' }}>
                <div className="stat">
                  <span className="star">★</span> {prof.rating} <span className="reviews">({prof.reviews} avaliações)</span>
                </div>
                <div className="stat">📍 {prof.city}</div>
                <div className="stat">⏱️ {prof.experience}</div>
              </div>
            </div>
            
            <div className="profile-actions">
              <button className="btn-accent">Solicitar orçamento</button>
              <button className="btn-primary">Conversar</button>
              <FavoriteButton profissionalId={prof.id} initialIsFavorito={false} />
            </div>
          </div>
        </div>

        <div className="profile-details-grid" style={{ padding: '0 2rem 2rem' }}>
          <div className="main-column">
            <div className="detail-card glass-panel" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <h2 className="section-title">Sobre o Profissional</h2>
              <p style={{ lineHeight: 1.6, color: 'var(--text-light)' }}>{prof.about}</p>
            </div>

            <div className="detail-card glass-panel" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <h2 className="section-title">Galeria de Trabalhos</h2>
              <div className="gallery-grid">
                {prof.gallery.map((item: any, idx: number) => (
                  <div key={idx} className="gallery-item">
                    <img src={item.url} alt={`${item.type} de ${prof.name}`} />
                    <div className="gallery-caption">{item.type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="sidebar-column">
             <div className="detail-card glass-panel" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Informações</h2>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Preço Médio</div>
                  <div className="price-tag" style={{ fontSize: '1.25rem' }}>{prof.price}</div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Tempo de Experiência</div>
                  <div>{prof.experience} no mercado</div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Formas de Pagamento</div>
                  <div>Cartão, Pix, Boleto</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

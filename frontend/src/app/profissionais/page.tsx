/* eslint-disable */
import React from 'react';
import Link from 'next/link';
import './vitrine.css';

const professionals = [
  {
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
    profileImage: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=1965&auto=format&fit=crop'
  },
  {
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
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    specialty: 'Encanador e Bombeiro Hidráulico',
    rating: 4.8,
    reviews: 215,
    experience: '15 anos',
    city: 'Belo Horizonte, MG',
    price: 'R$ 120/visita',
    availability: 'Disponível amanhã',
    coverImage: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2070&auto=format&fit=crop',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
  }
];

export default function MarketplaceList() {
  return (
    <div className="marketplace-container">
      <header className="marketplace-header glass-panel">
        <h1>Vitrine de Profissionais</h1>
        <p>Encontre os melhores especialistas para o seu projeto</p>
      </header>

      <div className="professional-grid">
        {professionals.map((prof) => (
          <div key={prof.id} className="professional-card glass-panel">
            <div className="card-cover" style={{ backgroundImage: `url(${prof.coverImage})` }}>
              <div className="availability-badge">{prof.availability}</div>
            </div>
            
            <div className="card-body">
              <div className="profile-image-container">
                <img src={prof.profileImage} alt={prof.name} className="profile-image" />
              </div>
              
              <div className="card-info">
                <h2>{prof.name}</h2>
                <p className="specialty">{prof.specialty}</p>
                
                <div className="stats-row">
                  <div className="stat">
                    <span className="star">★</span> {prof.rating} 
                    <span className="reviews">({prof.reviews} avaliações)</span>
                  </div>
                  <div className="stat">
                    <span className="icon">⏱️</span> {prof.experience}
                  </div>
                </div>
                
                <div className="location-price">
                  <span>📍 {prof.city}</span>
                  <span className="price-tag">💰 {prof.price}</span>
                </div>
              </div>
              
              <div className="card-actions">
                <Link href={`/profissionais/${prof.id}`} className="btn-primary">
                  Ver Perfil
                </Link>
                <button className="btn-secondary">Favoritar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


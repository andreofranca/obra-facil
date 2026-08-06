import { Metadata } from "next";
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../vitrine.css';
import { FavoriteButton } from "@/components/profissional/FavoriteButton";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const prof = await prisma.profissional.findUnique({
    where: { id: params.id },
    include: { user: true }
  });
  if (!prof) return { title: 'Profissional Não Encontrado' };
  return { title: `${prof.user.name} | ObraFácil Marketplace` };
}

export default async function ProfessionalProfile({ params }: { params: { id: string } }) {
  const prof = await prisma.profissional.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      servicos: {
        include: { categoria: true }
      },
      endereco: true,
      avaliacoesServico: true,
    }
  });

  if (!prof) {
    return notFound();
  }

  const initials = prof.user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  const especialidade = prof.servicos[0]?.categoria?.nome || "Profissional parceiro";

  let reviewsCount = 0;
  let rating = 0;
  if (prof.avaliacoesServico && prof.avaliacoesServico.length > 0) {
    reviewsCount = prof.avaliacoesServico.length;
    rating = Math.round(prof.avaliacoesServico.reduce((acc, curr) => acc + curr.nota, 0) / reviewsCount);
  }
  const displayRating = reviewsCount > 0 ? rating.toFixed(1) : "Novo";

  return (
    <div className="marketplace-container">
      <Link href="/profissionais" style={{ color: '#a5b4fc', textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>
        ← Voltar para Vitrine
      </Link>
      
      <div className="profile-container glass-panel">
        <div className="profile-header">
          <div className="profile-cover" style={{ backgroundImage: `url(${prof.fotoCapa || ''})`, backgroundColor: '#1e293b' }}>
             <div className="availability-badge" style={{ top: '20px', right: '20px', fontSize: '1rem' }}>
                {prof.ativo ? 'Disponível' : 'Indisponível'}
             </div>
          </div>
          
          <div className="profile-header-content">
            {prof.fotoPerfil ? (
              <img src={prof.fotoPerfil} alt={prof.user.name} className="profile-avatar" />
            ) : (
              <div className="profile-avatar" style={{ backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>
                {initials}
              </div>
            )}
            
            <div className="profile-main-info">
              <h1>{prof.user.name}</h1>
              <p className="specialty" style={{ fontSize: '1.1rem' }}>{especialidade}</p>
              
              <div className="stats-row" style={{ border: 'none', padding: 0, justifyContent: 'flex-start', gap: '2rem' }}>
                <div className="stat">
                  <span className="star">★</span> {displayRating} <span className="reviews">({reviewsCount} avaliações)</span>
                </div>
                <div className="stat">📍 {prof.endereco?.cidade ? `${prof.endereco.cidade}, ${prof.endereco.estado}` : 'Local não informado'}</div>
                <div className="stat">⏱️ {prof.obrasExecutadas || 0} obras</div>
              </div>
            </div>
            
            <div className="profile-actions">
              <Link href={`/solicitar-servico?profissionalId=${prof.id}`} className="btn-accent" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                Solicitar orçamento
              </Link>
              <FavoriteButton profissionalId={prof.id} initialIsFavorito={false} />
            </div>
          </div>
        </div>

        <div className="profile-details-grid" style={{ padding: '0 2rem 2rem' }}>
          <div className="main-column">
            <div className="detail-card glass-panel" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <h2 className="section-title">Sobre o Profissional</h2>
              <p style={{ lineHeight: 1.6, color: 'var(--text-light)' }}>
                {prof.descricao || "Profissional parceiro ObraFácil."}
              </p>
            </div>

            {prof.galeria && prof.galeria.length > 0 && (
              <div className="detail-card glass-panel" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <h2 className="section-title">Galeria de Trabalhos</h2>
                <div className="gallery-grid">
                  {prof.galeria.map((url, idx) => (
                    <div key={idx} className="gallery-item">
                      <img src={url} alt={`Obra ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="sidebar-column">
             <div className="detail-card glass-panel" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Informações</h2>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Obras Executadas</div>
                  <div>{prof.obrasExecutadas || 0}</div>
                </div>

                {prof.certificacoes && prof.certificacoes.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Certificações</div>
                    <ul>
                      {prof.certificacoes.map((cert, i) => <li key={i}>{cert}</li>)}
                    </ul>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

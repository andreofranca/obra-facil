import React, { Suspense } from 'react';
import MarketplaceClient from './MarketplaceClient';

export const metadata = {
  title: 'Marketplace | ObraFácil',
  description: 'Encontre os melhores profissionais para sua obra.',
};

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="flex-1 w-full flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <MarketplaceClient />
    </Suspense>
  );
}

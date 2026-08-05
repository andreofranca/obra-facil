import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

export function OrdersList() {
  const orders = [
    { id: 'ORD-001', service: 'Limpeza Residencial', status: 'Em andamento', date: 'Hoje, 14:00', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'ORD-002', service: 'Manutenção Elétrica', status: 'Concluído', date: 'Ontem, 10:00', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'ORD-003', service: 'Instalação de Ar Condicionado', status: 'Aguardando Pagamento', date: '02 Ago, 09:00', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="divide-y divide-gray-100">
      {orders.map((order) => {
        const Icon = order.icon;
        return (
          <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.bg} ${order.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{order.service}</h4>
                <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <span>{order.date}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className={order.color}>{order.status}</span>
                </div>
              </div>
            </div>
            <div className="text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

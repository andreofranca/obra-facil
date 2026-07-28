import { describe, it, expect } from 'vitest';
import { StateMachine } from './StateMachine';
import { RequestStatus } from './RequestStatus';

describe('StateMachine', () => {
  it('deve iniciar no status inicial', () => {
    const sm = new StateMachine(RequestStatus.ABERTA);
    expect(sm.state).toBe(RequestStatus.ABERTA);
  });

  it('deve permitir transição válida (ABERTA -> PROPOSTAS)', () => {
    const sm = new StateMachine(RequestStatus.ABERTA);
    sm.transitionTo(RequestStatus.PROPOSTAS);
    expect(sm.state).toBe(RequestStatus.PROPOSTAS);
  });

  it('deve permitir fluxo feliz completo', () => {
    const sm = new StateMachine(RequestStatus.ABERTA);
    sm.transitionTo(RequestStatus.PROPOSTAS);
    sm.transitionTo(RequestStatus.NEGOCIACAO);
    sm.transitionTo(RequestStatus.ACEITA);
    sm.transitionTo(RequestStatus.EM_EXECUCAO);
    sm.transitionTo(RequestStatus.CONCLUIDA);
    expect(sm.state).toBe(RequestStatus.CONCLUIDA);
  });

  it('deve bloquear transição inválida (ABERTA -> CONCLUIDA)', () => {
    const sm = new StateMachine(RequestStatus.ABERTA);
    expect(() => {
      sm.transitionTo(RequestStatus.CONCLUIDA);
    }).toThrow('Transição inválida');
  });

  it('deve bloquear saída de estado final (CONCLUIDA)', () => {
    const sm = new StateMachine(RequestStatus.CONCLUIDA);
    expect(() => {
      sm.transitionTo(RequestStatus.CANCELADA);
    }).toThrow('Transição inválida');
  });
});

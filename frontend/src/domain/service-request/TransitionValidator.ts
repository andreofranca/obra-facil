import { RequestStatus } from './RequestStatus';

export class TransitionValidator {
  private static validTransitions: Record<RequestStatus, RequestStatus[]> = {
    [RequestStatus.ABERTA]: [RequestStatus.PROPOSTAS, RequestStatus.CANCELADA, RequestStatus.EXPIRADA],
    [RequestStatus.PROPOSTAS]: [RequestStatus.NEGOCIACAO, RequestStatus.ACEITA, RequestStatus.CANCELADA, RequestStatus.EXPIRADA],
    [RequestStatus.NEGOCIACAO]: [RequestStatus.ACEITA, RequestStatus.RECUSADA, RequestStatus.CANCELADA],
    [RequestStatus.ACEITA]: [RequestStatus.EM_EXECUCAO, RequestStatus.CANCELADA],
    [RequestStatus.EM_EXECUCAO]: [RequestStatus.CONCLUIDA, RequestStatus.CANCELADA],
    [RequestStatus.CONCLUIDA]: [], // Fim
    [RequestStatus.CANCELADA]: [], // Fim
    [RequestStatus.EXPIRADA]: [], // Fim
    [RequestStatus.RECUSADA]: [RequestStatus.PROPOSTAS, RequestStatus.CANCELADA], // Volta pra propostas se for recusada
  };

  public static canTransition(current: RequestStatus, next: RequestStatus): boolean {
    const allowed = this.validTransitions[current];
    return allowed ? allowed.includes(next) : false;
  }
}

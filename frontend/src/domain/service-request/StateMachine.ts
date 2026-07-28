import { RequestStatus } from './RequestStatus';
import { TransitionValidator } from './TransitionValidator';

export class StateMachine {
  private currentState: RequestStatus;

  constructor(initialState: RequestStatus = RequestStatus.ABERTA) {
    this.currentState = initialState;
  }

  public get state(): RequestStatus {
    return this.currentState;
  }

  public transitionTo(nextState: RequestStatus): void {
    if (!TransitionValidator.canTransition(this.currentState, nextState)) {
      throw new Error(`Transição inválida: Não é possível mudar de ${this.currentState} para ${nextState}`);
    }
    this.currentState = nextState;
  }
}

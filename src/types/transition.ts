import { PhiniteStateMachine } from 'phinite-state-machine';

export type TriggerCanceller = () => void;

export type TransitionTo<T> = (string | ((entity: T) => string))

export type TransitionCallback<T> = (entity: T) => void;

export interface Transition<T> {
  to: TransitionTo<T>;
  registerTrigger: (phiniteStateMachine: PhiniteStateMachine<T>) => TriggerCanceller;
  onTransition?: (entity: T) => void;
}
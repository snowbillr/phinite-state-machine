export type TriggerCanceller = () => void;
export type TriggerActivator = () => void;

export type TransitionTo<T> = string | ((entity: T) => string);

export type TransitionCallback<T> = (entity: T) => void;

export abstract class Transition<T> {
  public to: TransitionTo<T>;
  public onTransition?: TransitionCallback<T>;

  constructor(to: TransitionTo<T>, onTransition?: TransitionCallback<T>) {
    this.to = to;
    this.onTransition = onTransition;
  }

  abstract registerTrigger(activateTrigger: TriggerActivator): TriggerCanceller;

  abstract run(): void;
}

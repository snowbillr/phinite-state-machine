import { Transition, TransitionTo, TransitionCallback, TriggerCanceller } from 'types/transition';

export class BaseTransition<T> implements Transition<T> {
  public to: TransitionTo<T>;
  public onTransition?: TransitionCallback<T>;

  constructor(to: TransitionTo<T>, onTransition?: TransitionCallback<T>) {
    this.to = to;
    this.onTransition = onTransition;
  }

  registerTrigger(): TriggerCanceller {
    return () => {};
  }
}
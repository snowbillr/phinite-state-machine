export type TriggerCanceller = () => void;

export type TransitionTo<T> = string | ((entity: T) => string);

export type TransitionCallback<T> = (entity: T) => void;

type TransitionCallbacks<T> = {
  onTransition?: TransitionCallback<T>;
  onEnter?: TransitionCallback<T>;
  onLeave?: TransitionCallback<T>;
};

export abstract class Transition<T> {
  public to: TransitionTo<T>;

  private callbacks: TransitionCallbacks<T>;

  constructor(to: TransitionTo<T>, callbacks: TransitionCallbacks<T>) {
    this.to = to;
    this.callbacks = callbacks;
  }

  abstract registerTrigger(): TriggerCanceller;

  abstract run(): void;

  onEnter(entity: T) {
    this.callbacks.onEnter?.(entity);
  }

  onLeave(entity: T) {
    this.callbacks.onLeave?.(entity);
  }

  onTransition(entity: T) {
    this.callbacks.onTransition?.(entity);
  }
}

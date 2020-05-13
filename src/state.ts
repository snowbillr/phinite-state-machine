import { Transition } from 'transition';

type StateCallback<T> = (entity: T, data: object) => void;

type StateCallbacks<T> = {
  onEnter?: StateCallback<T>;
  onLeave?: StateCallback<T>;
  onUpdate?: StateCallback<T>;
};

export class State<T> {
  public id: string;
  public transitions: Transition<T>[];

  private callbacks: StateCallbacks<T>;
  private data: object;

  constructor(
    id: string,
    transitions: Transition<T>[],
    callbacks: StateCallbacks<T>,
    data: object = {}
  ) {
    this.id = id;
    this.transitions = transitions;
    this.callbacks = callbacks;
    this.data = data;
  }

  onEnter(entity: T) {
    this.callbacks.onEnter?.(entity, this.data);
  }

  onLeave(entity: T) {
    this.callbacks.onLeave?.(entity, this.data);
  }

  onUpdate(entity: T) {
    this.callbacks.onUpdate?.(entity, this.data);
  }
}

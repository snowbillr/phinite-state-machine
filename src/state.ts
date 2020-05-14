import { Transition } from './transition';

type StateCallback<T, U extends Phaser.Scene = Phaser.Scene> = (
  entity: T,
  scene: U,
  data: object
) => void;

type StateCallbacks<T, U extends Phaser.Scene = Phaser.Scene> = {
  onEnter?: StateCallback<T, U>;
  onLeave?: StateCallback<T, U>;
  onUpdate?: StateCallback<T, U>;
};

export class State<T, U extends Phaser.Scene = Phaser.Scene> {
  public id: string;
  public transitions: Transition<T>[];

  private callbacks: StateCallbacks<T, U>;
  private data: object;

  constructor(
    id: string,
    transitions: Transition<T>[],
    callbacks: StateCallbacks<T, U>,
    data: object = {}
  ) {
    this.id = id;
    this.transitions = transitions;
    this.callbacks = callbacks;
    this.data = data;
  }

  onEnter(entity: T, scene: U) {
    this.callbacks.onEnter?.(entity, scene, this.data);
  }

  onLeave(entity: T, scene: U) {
    this.callbacks.onLeave?.(entity, scene, this.data);
  }

  onUpdate(entity: T, scene: U) {
    this.callbacks.onUpdate?.(entity, scene, this.data);
  }
}

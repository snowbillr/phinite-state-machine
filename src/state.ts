import { Transition } from './transition';

type StateCallback<T, U extends Phaser.Scene = Phaser.Scene> = (
  entity: T,
  scene: U,
  transitionData: object
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
  // @ts-ignore
  private data: object;

  constructor(
    id: string,
    transitions: Transition<T>[],
    callbacks: StateCallbacks<T, U>,
    stateData: object = {}
  ) {
    this.id = id;
    this.transitions = transitions;
    this.callbacks = callbacks;
    this.data = stateData;
  }

  onEnter(entity: T, scene: U, transitionData?: any) {
    this.callbacks.onEnter?.(entity, scene, transitionData);
  }

  onLeave(entity: T, scene: U, transitionData?: any) {
    this.callbacks.onLeave?.(entity, scene, transitionData);
  }

  onUpdate(entity: T, scene: U, transitionData?: any) {
    this.callbacks.onUpdate?.(entity, scene, transitionData);
  }
}

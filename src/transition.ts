import Phaser from 'phaser';

export type TriggerCanceller = () => void;
export type TriggerActivator = (transitionData?: any) => void;

export type TransitionTo<T> = string | ((entity: T) => string);

export type TransitionCallback<T, U extends Phaser.Scene = Phaser.Scene> = (
  entity: T,
  scene: U,
  transitionData?: any
) => void;

export abstract class Transition<T, U extends Phaser.Scene = Phaser.Scene> {
  public to: TransitionTo<T>;

  constructor(to: TransitionTo<T>) {
    this.to = to;
  }

  abstract registerTrigger(
    activateTrigger: TriggerActivator,
    scene: U
  ): TriggerCanceller;

  // @ts-ignore
  onTransition(entity: T, scene: U, transitionData?: any) {
    // empty on purpose
  }
}

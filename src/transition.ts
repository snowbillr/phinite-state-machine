import Phaser from 'phaser';

export type TriggerCanceller = () => void;
export type TriggerActivator = () => void;

export type TransitionTo<T> = string | ((entity: T) => string);

export type TransitionCallback<T> = (entity: T) => void;

export abstract class Transition<T, U extends Phaser.Scene = Phaser.Scene> {
  public to: TransitionTo<T>;
  public onTransition?: TransitionCallback<T>;

  constructor(to: TransitionTo<T>, onTransition?: TransitionCallback<T>) {
    this.to = to;
    this.onTransition = onTransition;
  }

  abstract registerTrigger(
    activateTrigger: TriggerActivator,
    scene: U
  ): TriggerCanceller;
}

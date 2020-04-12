import Phaser from 'phaser';
import { Transition, TransitionTo, TransitionCallback, TriggerCanceller } from 'types/transition';
import { PhiniteStateMachine } from '../phinite-state-machine';

type ConditionCallback<T> = (entity: T) => boolean;

export class ConditionalTransition<T> implements Transition<T> {
  public to: TransitionTo<T>;
  public onTransition?: TransitionCallback<T>;

  private conditionCallback: ConditionCallback<T>;

  constructor(to: TransitionTo<T>, conditionCallback: ConditionCallback<T>, onTransition?: TransitionCallback<T>) {
    this.to = to;
    this.conditionCallback = conditionCallback;
    this.onTransition = onTransition;
  }

  registerTrigger(phiniteStateMachine: PhiniteStateMachine<T>): TriggerCanceller {
    const updateCallback = () => {
      if (this.conditionCallback(phiniteStateMachine.entity)) {
        phiniteStateMachine.doTransition(this);
      }
    }

    phiniteStateMachine.scene.events.on(Phaser.Scenes.Events.POST_UPDATE, updateCallback);

    return () => {
      phiniteStateMachine.scene.events.off(Phaser.Scenes.Events.POST_UPDATE, updateCallback);
    }
  }
}
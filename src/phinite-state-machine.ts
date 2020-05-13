import Phaser from 'phaser';
import { State } from './state';
import { Transition, TriggerCanceller, TriggerActivator } from './transition';
import { generateUuid } from './uuid';

export class PhiniteStateMachine<T> {
  public readonly scene: Phaser.Scene;
  public readonly entity: T;

  public currentState: State<T>;

  private states: State<T>[];
  private triggerCancelers: TriggerCanceller[];
  private triggerIds: string[];

  /*
  private enabled: boolean;
  private initialState: State<T>;
  */

  constructor(
    scene: Phaser.Scene,
    entity: T,
    states: State<T>[],
    initialState: State<T>
  ) {
    this.scene = scene;
    this.entity = entity;
    this.states = states;

    /*
    this.enabled = true;
    this.initialState = initialState;
    */

    this.currentState = initialState;
    this.triggerIds = [];
    this.triggerCancelers = [];

    this.registerTransitionTriggers();
  }

  update() {
    this.currentState.onUpdate(this.entity);
  }

  doTransition(transition: Transition<T>) {
    this.cancelTransitionTriggers();

    this.currentState.onLeave(this.entity);

    transition.onTransition(this.entity);

    const nextStateId =
      typeof transition.to === 'string'
        ? transition.to
        : transition.to(this.entity);
    this.currentState = this.states.find(
      state => state.id === nextStateId
    ) as State<T>;
    this.currentState.onEnter(this.entity);

    this.registerTransitionTriggers();
  }

  /*
  disable() {
    this.enabled = false;
    this.doTransition({ to: this.initialState.id });
    this.cancelTransitionTriggers();
  }

  enable() {
    this.enabled = true;
    this.registerTransitionTriggers();
  }

  isEnabled() {
    return this.enabled;
  }
  */

  destroy() {
    this.cancelTransitionTriggers();

    // delete this.entity;
    this.states = [];
    // delete this.currentState;
  }

  private cancelTransitionTriggers() {
    this.triggerIds = [];
    this.triggerCancelers.forEach(canceler => canceler());
    this.triggerCancelers = [];
  }

  private registerTransitionTriggers() {
    this.currentState.transitions.forEach(transition => {
      const triggerId = generateUuid();
      const activateTrigger: TriggerActivator = () => {
        if (this.triggerIds.includes(triggerId)) {
          this.doTransition(transition);
        }
      };
      this.triggerIds.push(triggerId);
      this.triggerCancelers.push(transition.registerTrigger(activateTrigger));
    });

    /*
    this.currentState.transitions.forEach(transition => {
      switch(transition.type) {
        case TransitionType.Conditional:
          this.registerConditionalTransitionTrigger(transition as PhiniteStateMachine.Transitions.ConditionalTransition<T>);
          break;
        case TransitionType.Timer:
          this.registerTimerTransitionTrigger(transition as PhiniteStateMachine.Transitions.TimerTransition<T>);
          break;
      }
    });
    */
  }

  /*
  private registerConditionalTransitionTrigger(transition: PhiniteStateMachine.Transitions.ConditionalTransition<T>) {
    const listener = () => {
      if (transition.condition(this.entity)) {
        this.doTransition(transition);
      }
    }

    this.scene.events.on(Phaser.Scenes.Events.POST_UPDATE, listener);
    this.triggerCancelers.push(() => this.scene.events.off(Phaser.Scenes.Events.POST_UPDATE, listener));
  }

  private registerTimerTransitionTrigger(transition: PhiniteStateMachine.Transitions.TimerTransition<T>) {
    const listener = () => {
      this.doTransition(transition);
    }

    const delay = (typeof transition.delay === 'number') ? transition.delay : transition.delay();
    const timer = this.scene.time.delayedCall(delay, listener);

    this.triggerCancelers.push(() => timer.remove());
  }
  */
}
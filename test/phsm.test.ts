import { PhiniteStateMachine } from '../src/phinite-state-machine';
import { Transition } from '../src/transition';
import { Scene } from '../mocks/phaser';
import { State } from '../src/state';

describe('PhiniteStateMachine', () => {
  it('exists', () => {
    expect(PhiniteStateMachine).toBeDefined();
  });

  describe('transitioning to a new state', () => {
    it('transitions when the activateTransition param is called and will not repeat that transition', () => {
      const entity = {
        id: 'entity',
      };

      const onTransitionSpy = jest.fn();
      let triggerTransition: () => void;
      class SimpleTransition extends Transition<typeof entity> {
        constructor() {
          super('stateB', onTransitionSpy);
        }

        registerTrigger(activateTransition: () => void) {
          triggerTransition = activateTransition;
          return () => null;
        }

        run() {}
      }

      const stateAOnEnterSpy = jest.fn();
      const stateAOnLeaveSpy = jest.fn();
      const stateBOnEnterSpy = jest.fn();
      const stateBOnLeaveSpy = jest.fn();

      const states = [
        new State('stateA', [new SimpleTransition()], {
          onEnter: stateAOnEnterSpy,
          onLeave: stateAOnLeaveSpy,
        }),
        new State('stateB', [], {
          onEnter: stateBOnEnterSpy,
          onLeave: stateBOnLeaveSpy,
        }),
      ];

      const scene = (new Scene() as unknown) as Phaser.Scene;
      new PhiniteStateMachine<typeof entity>(
        scene,
        entity,
        states,
        states[0]
      ).start();

      expect(stateAOnEnterSpy).toHaveBeenCalledTimes(1);

      triggerTransition!();

      expect(stateAOnLeaveSpy).toHaveBeenCalledWith(entity, scene, {});
      expect(onTransitionSpy).toHaveBeenCalledWith(entity);
      expect(stateBOnEnterSpy).toHaveBeenCalledWith(entity, scene, {});

      expect(stateAOnLeaveSpy.mock.invocationCallOrder[0]).toBeLessThan(
        onTransitionSpy.mock.invocationCallOrder[0]
      );
      expect(onTransitionSpy.mock.invocationCallOrder[0]).toBeLessThan(
        stateBOnEnterSpy.mock.invocationCallOrder[0]
      );

      expect(stateAOnEnterSpy).toHaveBeenCalledTimes(1);
      expect(stateBOnLeaveSpy).not.toHaveBeenCalled();

      triggerTransition!();

      expect(stateAOnLeaveSpy).toHaveBeenCalledTimes(1);
      expect(onTransitionSpy).toHaveBeenCalledTimes(1);
      expect(stateBOnEnterSpy).toHaveBeenCalledTimes(1);
      expect(stateAOnEnterSpy).toHaveBeenCalledTimes(1);
      expect(stateBOnLeaveSpy).not.toHaveBeenCalled();
    });

    it('can be told to transition from outside of a trigger', () => {
      const states = [
        new State<object>('a', [], {}),
        new State<object>('b', [], {}),
      ];

      const phsm = new PhiniteStateMachine<object>(
        (new Scene() as unknown) as Phaser.Scene,
        {},
        states,
        states[0]
      );

      const transitionSpy = jest.fn();
      phsm.transitionTo('b', transitionSpy);

      expect(phsm.currentState.id).toEqual('b');
      expect(transitionSpy).toHaveBeenCalled();
    });
  });
});

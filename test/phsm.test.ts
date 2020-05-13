import { PhiniteStateMachine } from '../src/phinite-state-machine';
import { Transition } from '../src/transition';
import { Scene } from '../mocks/phaser';
import { State } from '../src/state';

describe('PhiniteStateMachine', () => {
  it('exists', () => {
    expect(PhiniteStateMachine).toBeDefined();
  });

  describe('transitioning to a new state', () => {
    it('calls the state and transitions callbacks in the right order', () => {
      const entity = {
        id: 'entity',
      };

      const onTransitionSpy = jest.fn();
      const SimpleTransition = class extends Transition<typeof entity> {
        constructor() {
          super('stateB', { onTransition: onTransitionSpy });
        }

        registerTrigger() {
          return () => null;
        }

        run() {}
      };

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

      const phsm = new PhiniteStateMachine<typeof entity>(
        (new Scene() as unknown) as Phaser.Scene,
        entity,
        states,
        states[0]
      );

      phsm.doTransition(states[0].transitions[0]);

      expect(stateAOnLeaveSpy).toHaveBeenCalledWith(entity, {});
      expect(onTransitionSpy).toHaveBeenCalledWith(entity);
      expect(stateBOnEnterSpy).toHaveBeenCalledWith(entity, {});

      expect(stateAOnLeaveSpy.mock.invocationCallOrder[0]).toBeLessThan(
        onTransitionSpy.mock.invocationCallOrder[0]
      );
      expect(onTransitionSpy.mock.invocationCallOrder[0]).toBeLessThan(
        stateBOnEnterSpy.mock.invocationCallOrder[0]
      );

      expect(stateAOnEnterSpy).not.toHaveBeenCalled();
      expect(stateBOnLeaveSpy).not.toHaveBeenCalled();
    });

    it('transitions when the activateTransition param is called and will not repeat that transition', () => {
      const entity = {
        id: 'entity',
      };

      const onTransitionSpy = jest.fn();
      let triggerTransition: () => void;
      class SimpleTransition extends Transition<typeof entity> {
        constructor() {
          super('stateB', { onTransition: onTransitionSpy });
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

      new PhiniteStateMachine<typeof entity>(
        (new Scene() as unknown) as Phaser.Scene,
        entity,
        states,
        states[0]
      );

      triggerTransition!();

      expect(stateAOnLeaveSpy).toHaveBeenCalledWith(entity, {});
      expect(onTransitionSpy).toHaveBeenCalledWith(entity);
      expect(stateBOnEnterSpy).toHaveBeenCalledWith(entity, {});

      expect(stateAOnLeaveSpy.mock.invocationCallOrder[0]).toBeLessThan(
        onTransitionSpy.mock.invocationCallOrder[0]
      );
      expect(onTransitionSpy.mock.invocationCallOrder[0]).toBeLessThan(
        stateBOnEnterSpy.mock.invocationCallOrder[0]
      );

      expect(stateAOnEnterSpy).not.toHaveBeenCalled();
      expect(stateBOnLeaveSpy).not.toHaveBeenCalled();

      triggerTransition!();

      expect(stateAOnLeaveSpy).toHaveBeenCalledTimes(1);
      expect(onTransitionSpy).toHaveBeenCalledTimes(1);
      expect(stateBOnEnterSpy).toHaveBeenCalledTimes(1);
      expect(stateAOnEnterSpy).not.toHaveBeenCalled();
      expect(stateBOnLeaveSpy).not.toHaveBeenCalled();
    });
  });
});

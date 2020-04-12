import { PhiniteStateMachine } from '../src';
import { BaseTransition } from '../src/transitions/base-transition';
import { Scene } from '../mocks/phaser';

describe('PhiniteStateMachine', () => {
  it('exists', () => {
    expect(PhiniteStateMachine).toBeDefined();
  });

  describe('transitioning to a new state', () => {
    it('calls the state and transitions callbacks in the right order', () => {
      const onTransitionSpy = jest.fn();

      const entity = {
        id: 'entity'
      };

      const states = [
        {
          id: 'stateA',
          transitions: [
            new BaseTransition('stateB', onTransitionSpy)
          ],
          onEnter: jest.fn(),
          onLeave: jest.fn()
        },
        {
          id: 'stateB',
          transitions: [],
          onEnter: jest.fn(),
          onLeave: jest.fn()
        }
      ]

      const phsm = new PhiniteStateMachine<typeof entity>(new Scene() as unknown as Phaser.Scene, entity, states, states[0]);

      phsm.doTransition(states[0].transitions[0]);

      expect(states[0].onLeave).toHaveBeenCalledWith(entity, {});
      expect(onTransitionSpy).toHaveBeenCalledWith(entity);
      expect(states[1].onEnter).toHaveBeenCalledWith(entity, {});

      expect(states[0].onLeave.mock.invocationCallOrder[0]).toBeLessThan(onTransitionSpy.mock.invocationCallOrder[0]);
      expect(onTransitionSpy.mock.invocationCallOrder[0]).toBeLessThan(states[1].onEnter.mock.invocationCallOrder[0]);

      expect(states[0].onEnter).not.toHaveBeenCalled();
      expect(states[1].onLeave).not.toHaveBeenCalled();
    });
  });
});

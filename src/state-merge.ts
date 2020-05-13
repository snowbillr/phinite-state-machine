import { State, StateData } from 'types/state';

export function mergeStates<T>(
  state1: Partial<State<T>>,
  state2: Partial<State<T>>
): State<T> {
  const onEnterChain = [state1.onEnter, state2.onEnter].filter(Boolean);
  const onUpdateChain = [state1.onUpdate, state2.onUpdate].filter(Boolean);
  const onLeaveChain = [state1.onLeave, state2.onLeave].filter(Boolean);
  const transitions = [state1.transitions, state2.transitions]
    .filter(Boolean)
    .flat();

  const data: StateData = { ...state1.data, ...state2.data };

  const mergedState: State<T> = {
    id: (state1.id || state2.id)!,
    transitions,
    data,
    onEnter: (entity: T, data: StateData) =>
      onEnterChain.forEach(fn => fn!(entity, data)),
    onUpdate: (entity: T, data: StateData) =>
      onUpdateChain.forEach(fn => fn!(entity, data)),
    onLeave: (entity: T, data: StateData) =>
      onLeaveChain.forEach(fn => fn!(entity, data)),
  };

  return mergedState as State<T>;
}

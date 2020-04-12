import { Transition } from 'types/transition';

export type StateData = Record<string, any>;

export interface State<T> {
  id: string;

  data?: {[key: string]: any},
  transitions: Transition<T>[];

  onEnter?: (entity: T, data: StateData) => void;
  onUpdate?: (entity: T, data: StateData) => void;
  onLeave?: (entity: T, data: StateData) => void;
}
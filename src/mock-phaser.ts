export module Phaser {
  export interface Scene {
    events: {
      on: (a: any, b: any) => void,
      off: (a: any, b: any) => void,
    },

    time: {
      delayedCall: (a: any, b: any) => { remove: () => void }
    }
  }
}

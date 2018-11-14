import {
  createStreamBus,
  createPropertyBus,
} from './Bus'

/**
 * @module kefir-extra
 * @description
 * In addition to the modules defined here this module exports all
 * functions from [`kefir`][kefir].
 *
 * [kefir]: https://rpominov.github.io/kefir/
 */

export * from 'kefir'

export {
  createStreamBus,
  createPropertyBus,
}

export {
  combinePropertyObject,
  eventSum,
  endWith,
} from './Combinators'

export {
  onValue,
  getValue,
  getRef,
} from './Accessors'


/**
 * Turns a promise into a property that holds a promise state object.
 *
 * The promise state object has a `state` property that is either
 * `'pending'`, `'resolved'`, or `'rejected'`. If the state is
 * “resolved” then the object has a `value` property holding the
 * resolved value. If the state is “rejected” the object has an `error`
 * property.
 *
 * ~~~js
 * promiseProperty(promise)
 * .onValue((state) => {
 *   if (state.state === 'pending') {
 *     console.log('pending')
 *   } else if (state.state === 'resolved') {
 *     console.log('resolved', state.value)
 *   } else if (state.state === 'rejected') {
 *     console.log('rejected', state.error)
 *   }
 * })
 * ~~~
 *
 * @param {Promise<T>} promise
 * @returns {PromiseState<T>}
 */
export function promiseProperty (promise) {
  const bus = createPropertyBus({ state: 'pending' })
  promise.then(function (value) {
    bus.set({ state: 'resolved', value: value })
    bus.end()
  }, function (error) {
    bus.set({ state: 'rejected', error: error })
    bus.end()
  })
  return bus.property
}


/**
 * Create a property that is updated whenever the observable emits a
 * new event. The sampler function is used to obtain the value.
 *
 * @param {Observable<any>} obs
 * @param {function} sampler
 * @returns {Property<any>}
 */
export function sampleFrom (obs, sampler) {
  // We need to pass `noop` to get an initial, undefined value.
  return obs.toProperty(noop).map(sampler)
}

function noop () {}

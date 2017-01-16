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
} from './Combinators'


/**
 * Add a handler to be called when the observable emits a value.
 *
 * Returns a function that unsubcribes the handler.
 *
 * ~~~js
 * const off = K.onValue(obs, function (val) {
 *   console.log(val)
 * })
 * // Prints values
 * off()
 * ~~~
 *
 *
 * While the handler is subscribed we throw all errors on the stream.
 *
 * @param {K.Observable} obs
 * @param {function()} handler
 *
 * @returns {function()}
 */
export function onValue (obs, handler) {
  const subscription = obs.observe({
    value: handler,
    error: throwError,
  })

  return function off () {
    subscription.unsubscribe()
  }
}


function throwError (error) {
  throw error
}


/**
 * Gets the current value of a property and throws an error if the
 * property does not have a value.
 *
 * WARNING: Use this sparsely. Using this leads to un-idomatic code
 *
 * @param {K.Property<T>} prop
 * @returns {T}
 */
export function getValue (prop) {
  let called = false
  let value
  const off = onValue(prop, (x) => {
    value = x
    called = true
  })

  off()
  if (!called) {
    throw new Error('Property does not have current value')
  }

  return value
}


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
  const bus = createPropertyBus({state: 'pending'})
  promise.then(function (value) {
    bus.set({state: 'resolved', value: value})
    bus.end()
  }, function (error) {
    bus.set({state: 'rejected', error: error})
    bus.end()
  })
  return bus.property
}

import { assertIsProperty } from './Utils'


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
 * Returns a reference object to the current value of the property.
 *
 * ~~~js
 * const ref = K.getRef(prop)
 * ref.value // => current value
 * ref.dispose() // => unsubcribes once and for all
 * ~~~
 *
 * The function subscribes to the property immediately and sets the
 * `value` property of the reference object.
 *
 * The reference object also has a `dispose()` function that
 * unsubscribes from the property. In addition it cleans up the
 * reference deleting both the `value` and `dispose` properties.
 */
export function getRef (prop) {
  assertIsProperty(prop)
  const ref = { dispose }

  const unsub = onValue(prop, (value) => { ref.value = value })
  return ref

  function dispose () {
    unsub()
    delete ref.value
    delete ref.dispose
  }
}

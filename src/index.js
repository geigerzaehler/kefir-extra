import * as K from 'kefir'

export * from 'kefir'

/**
 * @module kefir-extra
 * @description
 * In addition to the modules defined here this module exports all
 * functions from [`kefir`][kefir].
 *
 * [kefir]: https://rpominov.github.io/kefir/
 */


/**
 * @type StreamBus<T>
 *
 * @property {Stream<T>} stream
 * @method emit(T)
 * @method end()
 */

/**
 * Create a bus that allows you to emit values on a stream.
 *
 *  ```js
 *  const bus = K.createStreamBus()
 *  bus.stream.log()
 *  bus.emit('VALUE')
 *  // <value> 'VALUE'
 *  bus.end()
 *  // <end>
 *  ```
 *
 * @returns {StreamBus}
 */
export function createStreamBus () {
  let currentEmitter

  const stream = K.stream((emitter) => {
    currentEmitter = emitter
    return function off () {
      currentEmitter = null
    }
  })

  return {
    stream: stream,
    end: end,
    emit: emit,
    isActive: () => !!currentEmitter,
  }

  function emit (value) {
    if (currentEmitter) {
      currentEmitter.emit(value)
    }
  }

  function end () {
    if (currentEmitter) {
      currentEmitter.end()
      currentEmitter = null
    }
  }
}


/**
 * @type PropertyBus<T>
 *
 * @property {Stream<T>} stream
 * @method {T -> void} emit
 */
/**
 * Create a bus that allows you to imperatively set the value of a
 * property.
 *
 * The returned bus has the following properties
 * - `property: Property<T>`
 * - `set(T): void`
 * - `end(): void`
 */
export function createPropertyBus (initialValue) {
  let currentEmitter
  let currentValue = initialValue
  initialValue = null

  const property = K.stream((emitter) => {
    currentEmitter = emitter
    return function off () {
      currentEmitter = null
    }
  }).toProperty(() => currentValue)

  return {
    property: property,
    end: end,
    set: set,
    isActive: () => !!currentEmitter,
  }

  function set (value) {
    currentValue = value
    if (currentEmitter) {
      currentEmitter.emit(value)
    }
  }

  function end () {
    if (currentEmitter) {
      currentEmitter.end()
      currentEmitter = null
      currentValue = null
    }
  }
}


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
  obs.onError(throwError)
  obs.onValue(handler)

  return function off () {
    obs.offValue(handler)
    obs.offError(throwError)
  }
}


function throwError (error) {
  throw error
}


export function combinePropertyObject (props) {
  const keys = Object.keys(props)
  const values = keys.map((k) => {
    const prop = props[k]
    assertIsProperty(prop)
    return prop
  })
  return K.combine(values, (...values) => zipObject(keys, values))
    .toProperty()
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


function assertIsProperty (prop) {
  if (
    !prop
    || typeof prop.getType !== 'function'
    || prop.getType() !== 'property'
  ) {
    throw new TypeError(`Value ${prop} must be a property`)
  }
}


function zipObject (keys, values) {
  const res = {}
  keys.forEach((k, i) => res[k] = values[i])
  return res
}

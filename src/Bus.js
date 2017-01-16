import * as K from 'kefir'

export function createStreamBus () {
  let currentEmitter
  let ended = false

  const stream = K.stream((emitter) => {
    if (ended) {
      emitter.end()
      return noop
    }
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
    ended = true
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
  let ended = false

  // free initial value reference
  initialValue = null

  const property = K.stream((emitter) => {
    if (ended) {
      emitter.end()
      return noop
    }
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
    ended = true
    if (currentEmitter) {
      currentEmitter.end()
      currentEmitter = null
    }
  }
}

function noop () {}

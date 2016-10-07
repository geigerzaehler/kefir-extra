import * as K from 'kefir'
export * from 'kefir'


/**
 * Create a bus that allows you to emit values on a stream.
 *
 * The returned bus has the following properties
 * - `stream: Stream<T>`
 * - `emit(T): void`
 * - `end(): void`
 */
export function createStreamBus () {
  let currentEmitter

  const stream = K.stream((emitter) => {
    currentEmitter = emitter
  })

  return {
    stream: stream,
    end: end,
    emit: emit,
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
  }).toProperty(() => currentValue)

  return {
    property: property,
    end: end,
    set: set,
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


export function combinePropertyObject (props) {
  const keys = Object.keys(props)
  const values = keys.map((k) => {
    const prop = props[k]
    assertIsProperty(prop)
    return prop
  })
  return K.combine(values, (...values) => zipObject(keys, values))
}


function assertIsProperty (prop) {
  if (
    !prop ||
    typeof prop.getType !== 'function'
    || prop.getType() !== 'property'
  ) {
    throw new TypeError('Object values must be properties')
  }
}


function zipObject (keys, values) {
  const res = {}
  keys.forEach((k, i) => res[k] = values[i])
  return res
}

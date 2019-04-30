import * as K from 'kefir'

export interface StreamBus<A, E> {
  stream: K.Stream<A, E>
  end (): void
  emit (a: A): void
  isActive (): boolean
}

export function createStreamBus<A, E> (): StreamBus<A, E> {
  let currentEmitter: K.Emitter<A, E> | null = null
  let ended = false

  const stream = K.stream<A, E>((emitter) => {
    if (ended) {
      emitter.end()
      return noop
    }
    currentEmitter = emitter
    return function off (): void {
      currentEmitter = null
    }
  })

  return {
    stream: stream,
    end: end,
    emit: emit,
    isActive: () => !!currentEmitter,
  }

  function emit (value: A): void {
    if (currentEmitter) {
      currentEmitter.emit(value)
    }
  }

  function end (): void {
    ended = true
    if (currentEmitter) {
      currentEmitter.end()
      currentEmitter = null
    }
  }
}

export interface PropertyBus<A, E> {
  property: K.Property<A, E>
  end (): void
  set (a: A): void
  isActive (): boolean
}

export function createPropertyBus<A, E> (initialValue: A): PropertyBus<A, E> {
  let currentEmitter: K.Emitter<A, E> | null = null
  let currentValue: A = initialValue
  let ended = false

  // free initial value reference
  initialValue = null as any

  const property = K.stream<A, E>((emitter) => {
    if (ended) {
      emitter.end()
      return noop
    }
    currentEmitter = emitter
    return function off (): void {
      currentEmitter = null
    }
  }).toProperty(() => currentValue)

  return {
    property: property,
    end: end,
    set: set,
    isActive: () => !!currentEmitter,
  }

  function set (value: A): void {
    currentValue = value
    if (currentEmitter) {
      currentEmitter.emit(value)
    }
  }

  function end (): void {
    ended = true
    if (currentEmitter) {
      currentEmitter.end()
      currentEmitter = null
    }
  }
}

function noop (): void {
  // tslint:disable-next-line no-empty
}

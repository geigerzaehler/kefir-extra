import * as K from './index.js'

export function createMockProperty (initial) {
  const bus = K.createPropertyBus(initial)
  bus.property.end = bus.end
  bus.property.set = bus.set
  return bus.property
}

export function createMockStream () {
  const bus = K.createStreamBus()
  bus.stream.end = bus.end
  bus.stream.emit = bus.emit
  return bus.stream
}

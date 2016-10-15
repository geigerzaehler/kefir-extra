Kefir Extra
===========

[![Build Status](https://travis-ci.org/geigerzaehler/kefir-extra.svg?branch=master)](https://travis-ci.org/geigerzaehler/kefir-extra)

A collection of combinators and helpers for the [Kefir][] library.

~~~js
import * as K from 'kefir-extra'

const bus = K.createPropertyBus('INITIAL')
const combined = K.combinePropertyObject({
  a: bus.property,
  b: K.constant(true),
})

combined.log()
// {a: 'INITIAL', b: true}

bus.set('OTHER')
// {a: 'OTHER', b: true}
~~~

[Kefir]: https://rpominov.github.io/kefir/

API
---

The `kefir-extra` module exports all functions from the `kefir` module plus the
following.

`import * as K from 'kefir-extra'`

[`createStreamBus()`](#K.createStreamBus)
| [`createPropertyBus()`](#K.createPropertyBus)
| [`combinePropertyObject()`](#K.combinePropertyObject)
| [`onValue()`](#K.onValue)

`import * as KM from 'kefir-extra/mock'`

[`createProperty()`](#KM.createProperty)
| [`createStream()`](#KM.createStream)


### `K.createStreamBus()` <a name="K.createStreamBus">

Create a bus that allows you to emit values on a stream.

~~~js
const bus = K.createStreamBus()
bus.stream.log()
bus.emit('VALUE')
// <value> 'VALUE'
bus.end()
// <end>
~~~

The returned bus object has the following properties
* `stream: Stream<T>`
* `emit(T): void`
* `end(): void`


### `K.createPropertyBus(initial)` <a name="K.createPropertyBus">

Create a bus that allows you to set the current value of a property.

~~~js
const bus = K.createPropertyBus('INITIAL')
bus.property.log()
// <value:current> 'INITIAL'
bus.set('VALUE')
// <value> 'VALUE'
bus.end()
// <end>
~~~

The returned bus object has the following properties
* `property: Stream<T>`
* `set(T): void`
* `end(): void`


### `K.combinePropertyObject(props)` <a name="K.combinePropertyObject">

Combines an object with properties as values into a property whose current value
is an object combining the current values.

~~~js
const combined = K.combinePropertyObject({
  a: K.constant('A'),
  b: K.constant('B'),
})
combined.log()
// <value:current> {a: 'A', b: 'B'}
~~~

Note that this function asserts that all values in the argument are properties.


### `K.onValue(obs, handler)` <a name="K.onValue">

Add a handler to be called when the observable emits a value.

Returns a function that unsubcribes the handler.

~~~js
const off = K.onValue(obs, function (val) {
  console.log(val)
})
// Prints values
off()
~~~

While the handler is subscribed we throw all errors on the stream.


### `KM.createProperty(initial)` <a name="KM.createProperty">

Returns an object that has the same interface as a Kefir property and the
additional `set(value)` and `end()` methods. These methods can be used to
control the state of the property.

You should only use this for testing purposes.


### `KM.createStream()` <a name="KM.createStream">

Returns an object that has the same interface as a Kefir stream and the
additional `emit(value)` and `end()` methods. These methods can be used to
control the state of the stream.

You should only use this for testing purposes.

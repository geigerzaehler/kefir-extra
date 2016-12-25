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

The `kefir-extra` module exports all functions from the `kefir` package at
version `v3.6.1` plus the following.

`import * as K from 'kefir-extra'`

[`createStreamBus()`](#K.createStreamBus)
| [`createPropertyBus()`](#K.createPropertyBus)
| [`combinePropertyObject()`](#K.combinePropertyObject)
| [`onValue()`](#K.onValue)
| [`getValue()`](#K.getValue)
| [`promiseProperty()`](#K.promiseProperty)

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


### `K.getValue(property)` <a name="K.getValue">

_Since v0.5.1_

Gets the current value of a property and throws an error if the property does
not have a value.

~~~js
const p = K.constant('A')
K.getValue(p) // => 'A'
~~~

Calling this function might have side-effects since we subscribe to the property
and then immediately unsubscribe again.

_WARNING:_ Use this sparsely. Using this leads to un-idomatic code.


### `K.promiseProperty(promise)` <a name="K.promiseProperty">

_Since v0.5.1_

Turns a promise into a property that holds a promise state object.

The promise state object has a `state` property that is either `'pending'`,
`'resolved'`, or `'rejected'`. If the state is “resolved” then the object has a
`value` property holding the resolved value. If the state is “rejected” the
object has an `error` property.

~~~js
K.promiseProperty(promise)
.onValue((state) => {
  if (state.state === 'pending') {
    console.log('pending')
  } else if (state.state === 'resolved') {
    console.log('resolved', state.value)
  } else if (state.state === 'rejected') {
    console.log('rejected', state.error)
  }
})
~~~

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

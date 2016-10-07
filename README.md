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

**kefir-extra**

[`createStreamBus()`](#createStreamBus)
| [`createPropertyBus()`](#createPropertyBus)
| [`combinePropertyObject()`](#combinePropertyObject)


### `createStreamBus()` <a name="createStreamBus">

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


### `createPropertyBus(initial)` <a name="createPropertyBus">

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


### `combinePropertyObject(props)` <a name="combinePropertyObject">

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

Changelog
=========

## Upcoming

* Added `K.eventSum()` function

## v0.5.1 2016-12-25

* Added `K.getValue()` function.
* Added `K.promiseProperty()` function.
* Upgraded to Kefir 3.6.1
* Fix a bug where a bus would not signal its end when subscribing to
  `bus.stream.onEnd()` _after_ calling `bus.end()`.
* `K.combinePropertyObject()` now returns a proper property

## v0.5.0 2016-10-16

Initial release

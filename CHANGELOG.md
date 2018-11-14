Changelog
=========

## Upcoming

* Upgrade `kefir` from v3.7.0 to v3.8.5

## v0.5.3 - 2017-01-16

* Added `K.getRef()` function
* Added `K.sampleFrom()` function

## v0.5.2 - 2016-12-30

* Added `K.eventSum()` function

## v0.5.1 - 2016-12-25

* Added `K.getValue()` function.
* Added `K.promiseProperty()` function.
* Upgraded to Kefir 3.6.1
* Fix a bug where a bus would not signal its end when subscribing to
  `bus.stream.onEnd()` _after_ calling `bus.end()`.
* `K.combinePropertyObject()` now returns a proper property

## v0.5.0 - 2016-10-16

Initial release

import * as sinon from 'sinon'
import * as assert from 'assert'

export function propertyValueEqual (property, expected) {
  let actual
  let hasValue = false
  const {unsubscribe} = property.observe({
    value (value) {
      hasValue = true
      actual = value
    },
  })
  assert.ok(hasValue, 'Property does not have current value')
  assert.deepEqual(actual, expected)
  unsubscribe()
}
export function calledOnceWith (spy, ...args) {
  sinon.assert.calledOnce(spy)
  sinon.assert.calledWith(spy, ...args)
}

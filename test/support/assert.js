import * as sinon from 'sinon'
import assert from 'assert'
import * as K from 'src'

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

export function propertySemantics (prop) {
  let value
  const off = K.onValue(prop, (x) => {
    value = x
  })
  assert.strictEqual(value, K.getValue(prop))
  off()
}

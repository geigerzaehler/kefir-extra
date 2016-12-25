import * as sinon from 'sinon'
import assert from 'assert'
import * as K from 'src'

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

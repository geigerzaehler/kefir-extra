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

// TODO it should be possible to pass a predicate here
export function currentValue (prop, value) {
  assert.strictEqual(K.getValue(prop), value)
}

export function observableHasEnded (obs) {
  let ended = false
  const subscription = obs.observe({
    end () {
      ended = true
    },
  })
  subscription.unsubscribe()
  if (!ended) {
    assert.fail(undefined, undefined, 'Observable has not ended yet')
  }
}

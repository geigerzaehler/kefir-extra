import * as K from 'src'
import * as KM from 'src/mock'
import { assert, sinon, collectEvents } from 'support'

describe('kefir-extra', function () {
  describe('#createStreamBus()', function () {
    it('emits value events', function () {
      const bus = K.createStreamBus()
      const valueReceived = sinon.spy()
      bus.stream.onValue(valueReceived)

      bus.emit('VAL')
      assert.calledOnceWith(valueReceived, 'VAL')

      valueReceived.resetHistory()
      bus.emit(2)
      assert.calledOnceWith(valueReceived, 2)
    })

    it('emits end event', function () {
      const bus = K.createStreamBus()
      const cb = sinon.spy()
      bus.stream.onEnd(cb)
      bus.end()
      assert.calledOnce(cb)
    })

    // TODO duplicates stream bus tests
    it('signals end when subscribing later', function () {
      const bus = K.createStreamBus()
      bus.end()
      assert.observableHasEnded(bus.stream)
    })

    // TODO duplicates stream bus tests
    it('signals end on subscription', function () {
      const bus = K.createStreamBus()
      const ended = sinon.spy()
      bus.stream.onEnd(ended)
      bus.end()
      sinon.assert.calledOnce(ended)
      assert.observableHasEnded(bus.stream)
    })
  })

  describe('#createPropertyBus()', function () {
    it('emits initial value', function () {
      const bus = K.createPropertyBus('INIT')
      const valueReceived = sinon.spy()
      bus.property.onValue(valueReceived)
      sinon.assert.calledWithExactly(valueReceived, 'INIT')
    })

    it('set value when subscribing later', function () {
      const bus = K.createPropertyBus('INIT')
      bus.set('VAL')
      const valueReceived = sinon.spy()
      bus.property.onValue(valueReceived)
      sinon.assert.calledWithExactly(valueReceived, 'VAL')
    })

    // TODO duplicates stream bus tests
    it('signals end when subscribing later', function () {
      const bus = K.createPropertyBus()
      bus.end()
      assert.observableHasEnded(bus.property)
    })

    // TODO duplicates stream bus tests
    it('signals end on subscription', function () {
      const bus = K.createPropertyBus()
      const ended = sinon.spy()
      bus.property.onEnd(ended)
      bus.end()
      sinon.assert.calledOnce(ended)
      assert.observableHasEnded(bus.property)
    })

    it('gets last value after bus has ended', function () {
      const bus = K.createPropertyBus()
      bus.set('JO')
      bus.end()
      assert.equal(K.getValue(bus.property), 'JO')
    })
  })

  describe('#combinePropertyObject()', function () {
    it('throws an error when one observable is not a property', function () {
      const a = KM.createProperty('A1')
      const b = KM.createStream('B1')
      assert.throws(() => {
        K.combinePropertyObject({ a, b })
      }, TypeError)
    })

    it('has property semantics', function () {
      const x = K.combinePropertyObject({
        a: KM.createProperty('A1'),
        b: KM.createProperty('B1'),
      })
      assert.propertySemantics(x)
    })

    it('combines the initial state', function () {
      const a = KM.createProperty('A1')
      const b = KM.createProperty('B1')
      const x = K.combinePropertyObject({ a, b })
      assert.deepEqual(K.getValue(x), { a: 'A1', b: 'B1' })

      b.set('B2')
      assert.deepEqual(K.getValue(x), { a: 'A1', b: 'B2' })
    })

    it('updates object value when property changes', function () {
      const a = KM.createProperty('A1')
      const b = KM.createProperty('B1')
      const x = K.combinePropertyObject({ a, b })

      const cb = sinon.spy()
      x.onValue(cb)

      cb.resetHistory()
      b.set('B2')
      assert.calledOnceWith(cb, sinon.match({ a: 'A1', b: 'B2' }))

      cb.resetHistory()
      a.set('A2')
      assert.calledOnceWith(cb, sinon.match({ a: 'A2', b: 'B2' }))
    })
  })

  describe('#eventSum', function () {
    it('emits wrapped event', function () {
      const a = KM.createStream()
      const b = KM.createStream()
      const c = KM.createStream()

      const sum = K.eventSum({ a, b, c })
      const events = collectEvents(sum)

      assert.deepEqual(events, [])
      a.emit('a1')
      b.emit('b2')
      c.emit('c3')
      b.emit('b4')
      assert.deepEqual(events, [
        { type: 'b', value: 'b4' },
        { type: 'c', value: 'c3' },
        { type: 'b', value: 'b2' },
        { type: 'a', value: 'a1' },
      ])
    })
  })

  describe('#onValue()', function () {
    it('activates and deactivates stream', function () {
      const s = KM.createStream()
      assert.ok(!s.isActive())

      const off = K.onValue(s, sinon.spy())
      assert.ok(s.isActive())

      off()
      assert.ok(!s.isActive())
    })

    it('calls handler when event is emitted', function () {
      const handler = sinon.spy()
      const s = KM.createStream()
      K.onValue(s, handler)
      s.emit('VAL')
      assert.calledOnceWith(handler, 'VAL')
    })

    it('does not call handler when unsubcribed', function () {
      const handler = sinon.spy()
      const s = KM.createStream()
      const off = K.onValue(s, handler)
      off()
      s.emit('VAL')
      assert.notCalled(handler)
    })
  })

  describe('#getValue()', function () {
    it('obtains the current value from a property', function () {
      const p = KM.createProperty('A')
      assert.equal(K.getValue(p), 'A')
      p.set('B')
      assert.equal(K.getValue(p), 'B')
    })

    it('activates and then deactivates the property', function () {
      const deactivate = sinon.spy()
      const activate = sinon.stub().returns(deactivate)
      const p = K.stream(activate).toProperty(() => null)
      K.getValue(p)
      assert.calledOnce(activate)
      assert.calledOnce(deactivate)
    })

    it('throws when there is no current value', function () {
      const p = K.never().toProperty()
      assert.throws(
        () => K.getValue(p),
        Error,
        'Property does not have current value'
      )
    })
  })

  describe('#promiseProperty()', function () {
    it('has pending state when promise is pending', function () {
      const deferred = makeDeferred()
      const prop = K.promiseProperty(deferred.promise)
      assert.deepEqual(K.getValue(prop), { state: 'pending' })
    })

    it('has resolved state when promise is resolved', function* () {
      const deferred = makeDeferred()
      const prop = K.promiseProperty(deferred.promise)
      deferred.resolve('X')
      yield deferred.promise
      assert.deepEqual(K.getValue(prop), { state: 'resolved', value: 'X' })
      assert.observableHasEnded(prop)
    })

    it('has rejected state when promise is rejected', function* () {
      const deferred = makeDeferred()
      const prop = K.promiseProperty(deferred.promise)
      deferred.reject('X')
      yield invertPromise(deferred.promise)
      assert.deepEqual(K.getValue(prop), { state: 'rejected', error: 'X' })
      assert.observableHasEnded(prop)
    })

    function makeDeferred () {
      const deferred = {}
      deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve
        deferred.reject = reject
      })
      return deferred
    }
  })

  describe('#getRef()', function () {
    it('throws when given a stream', function () {
      assert.throws(() => {
        K.getRef(KM.createStream())
      }, TypeError)
    })

    it('updates ref when value changes', function () {
      const p = KM.createProperty('A')
      const ref = K.getRef(p)
      assert.equal(ref.value, 'A')

      p.set('B')
      assert.equal(ref.value, 'B')
    })

    it('unsubscribes when ref is disposed', function () {
      const p = KM.createProperty('A')
      const ref = K.getRef(p)
      ref.dispose()
      assert.equal(p.isActive(), false)
      assert.equal('value' in ref, false)
      assert.equal('dispose' in ref, false)
    })
  })

  describe('#sampleFrom()', function () {
    it('samples initial value when subscribing', function () {
      const trigger = KM.createStream()
      const sample = sinon.stub()
      const p = K.sampleFrom(trigger, sample)
      sample.returns('A')
      assert.currentValue(p, 'A')

      sample.returns('B')
      assert.currentValue(p, 'B')
    })

    it('updates property when trigger emits a value', function () {
      const trigger = KM.createStream()
      const sample = sinon.stub()
      sample.returns('A')

      const p = K.sampleFrom(trigger, sample)
      const ref = K.getRef(p)

      sample.returns('B')
      assert.equal(ref.value, 'A')
      trigger.emit()
      assert.equal(ref.value, 'B')
    })
  })
})

function invertPromise (p) {
  return p.then(
    () => { throw new Error('Unexpectedly resolved promise') },
    (e) => e
  )
}

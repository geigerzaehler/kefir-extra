import * as K from 'src'
import * as KM from 'src/mock'
import {assert, sinon} from 'support'

describe('kefir-extra', function () {
  describe('#createStreamBus()', function () {
    it('emits value events', function () {
      const bus = K.createStreamBus()
      const valueReceived = sinon.spy()
      bus.stream.onValue(valueReceived)

      bus.emit('VAL')
      assert.calledOnceWith(valueReceived, 'VAL')

      valueReceived.reset()
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
  })

  describe('#combinePropertyObject()', function () {
    it('throws an error when one observable is not a property', function () {
      const a = KM.createProperty('A1')
      const b = KM.createStream('B1')
      assert.throws(() => {
        K.combinePropertyObject({a, b})
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
      const x = K.combinePropertyObject({a, b})
      assert.propertyValueEqual(x, {a: 'A1', b: 'B1'})

      b.set('B2')
      assert.propertyValueEqual(x, {a: 'A1', b: 'B2'})
    })

    it('updates object value when property changes', function () {
      const a = KM.createProperty('A1')
      const b = KM.createProperty('B1')
      const x = K.combinePropertyObject({a, b})

      const cb = sinon.spy()
      x.onValue(cb)

      cb.reset()
      b.set('B2')
      assert.calledOnceWith(cb, sinon.match({a: 'A1', b: 'B2'}))

      cb.reset()
      a.set('A2')
      assert.calledOnceWith(cb, sinon.match({a: 'A2', b: 'B2'}))
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
})

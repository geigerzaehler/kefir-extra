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
      const a = KM.createMockProperty('A1')
      const b = KM.createMockStream('B1')
      assert.throws(() => {
        K.combinePropertyObject({a, b})
      }, TypeError)
    })

    it('combines the initial state', function () {
      const a = KM.createMockProperty('A1')
      const b = KM.createMockProperty('B1')
      const x = K.combinePropertyObject({a, b})
      assert.propertyValueEqual(x, {a: 'A1', b: 'B1'})

      b.set('B2')
      assert.propertyValueEqual(x, {a: 'A1', b: 'B2'})
    })

    it('updates object value when property changes', function () {
      const a = KM.createMockProperty('A1')
      const b = KM.createMockProperty('B1')
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
})

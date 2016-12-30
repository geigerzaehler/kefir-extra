import * as sinon from 'sinon'
import * as assertNode from 'assert'
import * as assertUtils from './assert'

export {sinon}

export const assert = Object.assign({}, assertNode, sinon.assert, assertUtils)


export function collectEvents (obs) {
  const events = []
  obs.onValue((v) => events.unshift(v))
  return events
}

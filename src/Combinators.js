import * as K from 'kefir'
import { assertIsProperty } from './Utils'

export function combinePropertyObject (props) {
  const keys = Object.keys(props)
  const values = keys.map((k) => {
    const prop = props[k]
    assertIsProperty(prop)
    return prop
  })
  return K.combine(values, (...values) => zipObject(keys, values))
    .toProperty()
}


export function eventSum (events) {
  const types = Object.keys(events)
  const streams = types.map((type) => {
    return events[type].map((value) => ({type, value}))
  })
  return K.merge(streams)
}

function zipObject (keys, values) {
  const res = {}
  keys.forEach((k, i) => { res[k] = values[i] })
  return res
}

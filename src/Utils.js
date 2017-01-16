export function assertIsProperty (prop) {
  if (
    !prop ||
    typeof prop.getType !== 'function' ||
    prop.getType() !== 'property'
  ) {
    throw new TypeError(`Value ${prop} must be a property`)
  }
}

function stringify (value, space) {
  return JSON.stringify(value, replacer, space)
}

function parse (text) {
  return JSON.parse(text, reviver)
}

function replacer (key, value) {
  if (isBufferLike(value)) {
    if (isArray(value.data)) {
      if (value.data.length > 0) {
        value.data = 'binary:' + Buffer.from(value.data).toString('binary')
      } else {
        value.data = ''
      }
    }
  }
  return value
}

function reviver (key, value) {
  if (isBufferLike(value)) {
    if (isArray(value.data)) {
      return Buffer.from(value.data)
    } else if (isString(value.data)) {
      if (value.data.startsWith('binary:')) {
        return Buffer.from(value.data.slice('binary:'.length), 'binary')
      }
      // Assume that the string is UTF-8 encoded (or empty).
      return Buffer.from(value.data)
    }
  }
  return value
}

function isBufferLike (x) {
  return (
    isObject(x) && x.type === 'Buffer' && (isArray(x.data) || isString(x.data))
  )
}

function isArray (x) {
  return Array.isArray(x)
}

function isString (x) {
  return typeof x === 'string'
}

function isObject (x) {
  return typeof x === 'object' && x !== null
}

module.exports = {
  stringify,
  parse,
  replacer,
  reviver
}
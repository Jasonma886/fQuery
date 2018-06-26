import FQuery from './FQuery'

const helper = function (selector) {
  return new FQuery(selector)
}

helper.each = function (obj, callback) {
  let length
  let i = 0
  if (Array.isArray(obj)) {
    length = obj.length
    for (; i < length; i++) {
      if (callback.call(obj[ i ], i, obj[ i ]) === false) {
        break
      }
    }
  } else {
    for (i in obj) {
      if (callback.call(obj[ i ], i, obj[ i ]) === false) {
        break
      }
    }
  }
  return obj
}

export default helper

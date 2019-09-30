const test = require('ava')
const { genRandomString } = require('./')

test('genRandomString generates a random string in the given length', (t) => {
  return genRandomString(16).then(str => {
    t.is(str.length, 16)
  })
})

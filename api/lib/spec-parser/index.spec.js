const mock = require('./mock')
const specParser = require('../spec-parser')
const test = require('ava')

test('Original spec has paths assigned', (t) => {
  return specParser(mock).then((spec) => {
    t.is(typeof spec.auth, 'object')
  })
})

test('Parsed result is an object', (t) => {
  return specParser(mock).then((spec) => {
    t.is(typeof spec, 'object')
  })
})

test('auth.signIn can be called without auth header', (t) => {
  return specParser(mock).then((spec) => {
    const signIn = spec.auth.signIn
    t.is(signIn.security.length === 0, true)
  })
})

test('auth.signIn requires email', (t) => {
  return specParser(mock).then((spec) => {
    const signIn = spec.auth.signIn
    const signInSchema = signIn.requestBody.content['application/json'].schema
    t.is(signInSchema.required.includes('email'), true)
  })
})

test('auth.signIn requires password', (t) => {
  return specParser(mock).then((spec) => {
    const signIn = spec.auth.signIn
    const signInSchema = signIn.requestBody.content['application/json'].schema
    t.is(signInSchema.required.includes('password'), true)
  })
})

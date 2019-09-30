const test = require('ava')
const doc = require('@root/openapi.json')
const testing = require('@root/lib/utils/testing')
const specParser = require('@root/lib/spec-parser')

const mockCredentials = require('../../account/mock')
const accountService = require('../../account/service')
const AccountModel = require('../../account/model')
const admin = { ...mockCredentials[0] }
const user = { ...mockCredentials[1] }

testing.setup(test)

test.serial('token create should return 400 for invalid credentials', async (t) => {
  await AccountModel.deleteMany()
  const spec = await specParser(doc)
  await accountService.create({ email: admin.email, password: admin.password })
  const res = await testing.createRequest()
    .post('/v1' + spec.auth.signIn.path)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      email: 'yolo@yolo',
      password: 'Swagg3r'
    })

  t.is(res.status, 400)
  t.is(res.body.token, undefined)
})

test.serial('token create should return 201 and a new token', async (t) => {
  await AccountModel.deleteMany()
  const spec = await specParser(doc)
  const { email, password } = user
  await accountService.create({ email, password })
  const res = await testing.createRequest()
    .post('/v1' + spec.auth.signIn.path)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      email,
      password
    })

  t.is(res.status, 201)
  t.is(!!res.body.token, true)
})

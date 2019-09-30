const URI = require('urijs')
const test = require('ava')
const _ = require('lodash')
const Account = require('./model')
require('urijs/src/URITemplate')
const testing = require('@root/lib/utils/testing')
const doc = require('@root/openapi.json')
const specParser = require('@root/lib/spec-parser')
const mock = require('./mock')
const service = require('./service')
const authTokenService = require('../auth/token/service')
const admin = { ...mock[0] }
const user = { ...mock[1] }
const { ADMIN_PW, ADMIN_EMAIL } = process.env

testing.setup(test)

test.serial('account create should return 201', async (t) => {
  await Account.deleteMany()
  await service.create(admin)
  const spec = await specParser(doc)
  const { token } = await authTokenService.create({ email: ADMIN_EMAIL, password: ADMIN_PW })
  const res = await testing.createRequest()
    .post('/v1' + spec.account.createAccount.path)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      email: user.email,
      password: user.password
    })

  t.is(res.status, 201)
})

test.serial('account show should fail without token', async (t) => {
  const spec = await specParser(doc)
  const res = await testing.createRequest()
    .get('/v1' + URI.expand(spec.account.showAccount.path, { id: '5cc042736405f1002ba0be9b' }))
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')

  t.is(res.status, 401)
})

test.serial('account show should return account with valid token', async (t) => {
  const spec = await specParser(doc)
  await Account.deleteMany()
  const { id } = await service.create({ email: user.email, password: user.password })
  const { token } = await authTokenService.create({ email: user.email, password: user.password })
  const res = await testing.createRequest()
    .get('/v1' + URI.expand(spec.account.showAccount.path, { id: id.toString() }))
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')

  const { account } = res.body

  t.is(res.status, 200)
  t.is(_.isObject(account), true)
  t.is(id.equals(account.id), true)
  t.is(account.password, undefined)
})

test.serial('account list should fail without token', async (t) => {
  const res = await testing.createRequest()
    .get('/v1/accounts')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')

  t.is(res.status, 401)
})

test.serial('account list should return forbidden for non-admins', async (t) => {
  await Account.deleteMany()
  await Promise.all(mock.map(service.create))
  const { token } = await authTokenService.create({ email: user.email, password: user.password })
  const res = await testing.createRequest()
    .get('/v1/accounts')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')

  t.is(res.status, 403)
})

test.serial('account list should return accounts for admins', async (t) => {
  await Account.deleteMany()
  await Promise.all(mock.map(service.create))
  const { token } = await authTokenService.create({ email: admin.email, password: admin.password })
  const res = await testing.createRequest()
    .get('/v1/accounts')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')

  const { accounts } = res.body
  t.is(res.status, 200)
  t.is(Array.isArray(accounts), true)
  t.is(accounts[0].password, undefined)
})

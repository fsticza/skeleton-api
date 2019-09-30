const mongoose = require('mongoose')
const MongoMemoryServer = require('mongodb-memory-server').default
const request = require('supertest')
const app = require('@root/')
 
const mongoServer = new MongoMemoryServer()
mongoose.Promise = Promise

const prepareMockDB = async () => {
  mongoServer.getConnectionString().then((mongoUri) => {
    const mongooseOpts = {
      autoReconnect: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    }

    mongoose.connect(mongoUri, mongooseOpts)

    mongoose.connection.on('error', (e) => {
      if (e.message.code === 'ETIMEDOUT') {
        console.log(e)
        mongoose.connect(mongoUri, mongooseOpts)
      }
      console.log(e)
    })

    mongoose.connection.once('open', () => {
      console.log(`MongoDB successfully connected to ${mongoUri}`)
    })
  })
}

module.exports = {
  createServer (port = Math.floor(Math.random() * (65536 - 3000 + 1)) + 3000) {
    return app.listen(port, () => console.log(`Listening on ${port}`))
  },
  createRequest () {
    const server = this.createServer()
    return request(server)
  },
  setup (test) {
    test.before(async t => {
      try {
        await prepareMockDB()
      } catch (err) {
        t.fail(err)
      }
    })
    test.beforeEach(async t => {
      // TODO: create account
    })
    test.afterEach(async t => {
      // TODO: remove account and reset only in after
    })
    test.after(async t => {
      mongoose.disconnect()
      mongoServer.stop()
    })
    return test
  }
}

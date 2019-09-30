const mongoose = require('mongoose')
mongoose.Promise = Promise
const DATABASE_URL = process.env.DATABASE_URL

module.exports = {
  async connect () {
    const connection = await mongoose.connect(DATABASE_URL, {
      useUnifiedTopology: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true
    })
    return connection
  }
}

const mongoose = require('mongoose')

const MONGO_URL = 'mongodb://localhost/'
// const DEV_DB_NAME = 'devjkhello'
// const PRO_DB_NAME = 'projkhello'
// const DB_NAME =
//   process.env.NODE_ENV === 'production' ? PRO_DB_NAME : DEV_DB_NAME
const DB_NAME = process.env.JK_DBNAME
console.log(DB_NAME)
const dbUri = `${MONGO_URL}${DB_NAME}`
async function connectDB() {
  console.log('connectdb')
  await mongoose.connect(`${MONGO_URL}${DB_NAME}`)
}
async function disconnectDB() {
  await mongoose.disconnect()
}
// 2
mongoose.connection
  .on('connecting', () => {
    console.log(2)
  })
  .on('connected', () => {
    console.log(1)
  })
  .on('disconnecting', () => {
    console.log(3)
  })
  .on('disconnected', () => {
    console.log(0)
  })

module.exports = {
  connectDB,
  disconnectDB,
  DB_NAME,
  dbUri,
}

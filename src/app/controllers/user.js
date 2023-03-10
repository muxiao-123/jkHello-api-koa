const mongoose = require('mongoose')

const User = mongoose.model('User')
const baseUrl = `${process.env.JK_STATIC_URL}jkHello.png`
const addUser = async (email) => {
  const random = (Math.random() * 1000000).toFixed()
  const userInfo = {
    name: `jkhello_${random}`,
    hashed_password: User.prototype.encryptPassword('11111111'),
    email,
    username: `jkhello_${random}`,
    url: baseUrl,
  }
  const user = new User(userInfo)
  const result = await user.save()
  return result
}

const queryUser = async (email) => {
  const query = User.find({ email }, 'name username email url _id')
  const result = await query.exec()
  console.log(result)
  return result
}
const queryAllUser = async () => {
  // const query = User.find().countDocuments()
  const query = User.find({}, 'name email username')
  const result = await query.exec()
  return result
}

const updateUser = async (email, options) => {
  const update = User.findOneAndUpdate({ email }, { ...options }, { new: true })
  const result = await update.exec()
  return result
}

module.exports = {
  addUser,
  queryUser,
  updateUser,
  queryAllUser,
}

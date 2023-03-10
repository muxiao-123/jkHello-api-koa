/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable func-names */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

console.log('come on')
mongoose.set('strictQuery', true)
const { Schema } = mongoose
// Schema.set('toJSON', { virtual: true })
const oAuthTypes = ['github']
const UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  username: { type: String, default: '' },
  // password: { type: String, default: '11111111' },
  // provider: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  url: { type: String, default: '' },
  role: { type: Number, default: 0 },
  real: { type: Boolean, default: true },
})

UserSchema.set('toJSON', { virtual: true })

const validatePresenceOf = (value) => value && value.length
// vitural
UserSchema.virtual('password')
  .set(function (password) {
    this._password = password
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

// validations
UserSchema.path('name').validate(function (name) {
  return name.length
}, 'Name cannot be blank')

UserSchema.path('email').validate(function (email) {
  return email.length
}, 'Email cannot be blank')

UserSchema.path('email').validate(function (email) {
  return new Promise((resolve) => {
    const User = mongoose.model('User')
    if (this.isNew || this.isModified('email')) {
      User.find({ email }).exec((err, users) => {
        resolve(!err && !users.length)
      })
    } else {
      resolve(true)
    }
  })
}, 'Email `{VALUE}` already exists')
UserSchema.path('username').validate(function (username) {
  return username.length
}, 'Username cannot be blank')
UserSchema.path('hashed_password').validate(function (hashed_password) {
  console.log(this.password)
  // return hashed_password.length && this._password.length
  return hashed_password.length
}, 'Password cannot be blank')

// pre-save hook
UserSchema.pre('save', function (next) {
  // console.log('comon')
  if (!this.isNew) {
    return next()
  }
  // next()
  // && !this.skipValidation()
  if (!validatePresenceOf(this.password)) {
    this.password = this.encryptPassword(this.hashed_password)
  }
  next()
})

// Methods
UserSchema.methods = {
  // Authenticate check if the passwords are the same
  authenticate(password) {
    return bcrypt.compareSync(password, this.hashed_password)
  },
  // Encrypt password
  encryptPassword(password) {
    if (!password) {
      return ''
    }
    try {
      return bcrypt.hashSync(password, 10)
    } catch (error) {
      return ''
    }
  },
  skipValidation() {
    return oAuthTypes.indexOf(this.provider)
  },
}

// Statics
UserSchema.statics = {
  load(options, cb) {
    options.select = options.select || 'name username'
    return this.findOne(options.criteria).select(options.select).exec(cb)
  },
}
mongoose.model('User', UserSchema)

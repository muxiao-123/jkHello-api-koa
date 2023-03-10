/* eslint-disable func-names */
const mongoose = require('mongoose')

// mogoose.set('strictQuery', true)
const { Schema } = mongoose
const RankSchema = new Schema({
  email: { type: String, default: '' },
  model: { type: String, default: '' },
  subject: { type: Number, default: 1 },
  grade: { type: Number, default: 0 },
  gradename: { type: String, default: '' },
  time: { type: Date, default: Date.now() },
  timepriod: { type: Number, default: 0 },
  totalnum: { type: Number, default: 100 },
  real: { type: Boolean, default: true },
})
// validations
RankSchema.path('email').validate(function (email) {
  return email.length
}, 'email cannot be blank')

RankSchema.path('email').validate(function (email) {
  return new Promise((resolve) => {
    const Rank = mongoose.model('Rank')
    if (this.isNew || this.isModified('email')) {
      Rank.find({ email }).exec((err, ranks) => {
        resolve(!err && !ranks.length)
      })
    } else {
      resolve(true)
    }
  })
}, 'Rank Email `{VALUE}` already exists')

RankSchema.path('model').validate(function (model) {
  return model.length
}, 'model cannot be blank')

RankSchema.path('subject').validate(function (subject) {
  return subject.length
}, 'subject cannot be blank')

RankSchema.path('grade').validate(function (grade) {
  return typeof grade === 'number'
}, 'grade cannot be blank')

RankSchema.path('gradename').validate(function (gradename) {
  return gradename.length
}, 'gradename cannot be blank')

// pre-save hook
RankSchema.pre('save', function (next) {
  if (!this.isNew) {
    return next()
  }
  next()
})
// Methods
RankSchema.methods = {
  // todo
}
// Statics
RankSchema.statics = {
  findByEmail(email, cb) {
    if (!email) {
      return {}
    }
    return this.find({}).exec(cb)
  },
  byGradeGetName(grade) {
    if (typeof grade !== 'number') {
      return '新人报道'
    }
    if (grade >= 100) {
      return '秋名山老司机'
    }
    if (grade >= 80) {
      return '老司机'
    }
    if (grade >= 60) {
      return '职业滑水'
    }
    if (grade >= 0) {
      return '新人报道'
    }
  },
  getRank100(cb) {
    return this.find({}).sort('-grade timepriod').limit(100).exec(cb)
  },
  async checkRankInfo(newValue, oldValue, cb = null) {
    if (
      newValue.grade > oldValue.grade ||
      newValue.timepriod < oldValue.timepriod
    ) {
      // update
      await this.findOneAndUpdate({ email: newValue.email }, newValue).exec(cb)
      // console.log(result)
      return true
    }
    return false
  },
  async overCome(gradeInfo, cb = null) {
    const { grade, timepriod, _id } = gradeInfo
    const rankArr = await this.find({})
      .sort('grade -timepriod')
      .select('grade timepriod _id')
      .exec(cb)
    console.log(rankArr)
    rankArr.push({ grade, timepriod, _id })
    rankArr.sort((a, b) => {
      if (a.grade === b.grade) {
        return b.timepriod - a.timepriod
      }
      return a.grade - b.grade
    })
    const index = rankArr.findIndex((rank) => rank._id === _id)
    console.log(index)
    return Math.round((index + 1) / rankArr.length) * 100
  },
  async byEmailGetIndex(email) {
    const resultArr = await this.find()
      .sort('-grade timepriod')
      .select('grade timepriod email')
      .exec()
    const index = resultArr.findIndex((rank) => rank.email === email)
    return index
  },
}
mongoose.model('Rank', RankSchema)

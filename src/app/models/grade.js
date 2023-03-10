/* eslint-disable func-names */
const mongoose = require('mongoose')

// mogoose.set('strictQuery', true)
const { Schema } = mongoose
const GradeSchema = new Schema({
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
GradeSchema.path('email').validate(function (email) {
  return email.length
}, 'email cannot be blank')

GradeSchema.path('model').validate(function (model) {
  return model.length
}, 'model cannot be blank')

GradeSchema.path('subject').validate(function (subject) {
  return subject.length
}, 'subject cannot be blank')

GradeSchema.path('grade').validate(function (grade) {
  return typeof grade === 'number'
}, 'grade must is number type')

GradeSchema.path('gradename').validate(function (gradename) {
  return gradename.length
}, 'gradename cannot be blank')

// pre-save hook
GradeSchema.pre('save', function (next) {
  if (!this.isNew) {
    return next()
  }
  next()
})
// Methods
GradeSchema.methods = {
  // todo
}
// Statics
GradeSchema.statics = {
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
  findMaxGrade(email, cb) {
    if (!email) {
      throw new TypeError('email is must')
    }
    return this.findOne({ email }).sort('-grade timepriod').exec(cb)
  },
  // email, email/model, email/subject sort -time
  findByEmail(options, sort = { text: 'time', type: -1 }, cb = null) {
    if (options) {
      throw new TypeError('findByEmail Fun options is must')
    }
    const sortText = sort.type === -1 ? '-time' : 'time'
    return this.find({ ...options })
      .sort(sort.sortName || sortText)
      .exec(cb)
  },
  async getAverageInfo(options, cb = null) {
    if (!options) {
      throw new TypeError('getAverageInfo Fun options is must')
    }
    const { email, model } = options
    const infoArr = await this.find({ email, model }).select('grade').exec(cb)
    let average = 0
    if (infoArr.length !== 0) {
      const totalGrade = infoArr.reduce((pre, cur) => {
        // eslint-disable-next-line no-param-reassign
        pre += cur.grade
        return pre
      }, 0)
      average = Math.round(totalGrade / infoArr.length)
    }
    console.log(infoArr)
    const maxGrade = await this.findOne({ email, model })
      .sort('-grade timepriod')
      .exec(cb)
    // console.log(maxGrade.toJSON({ virtuals: true }))
    return {
      examNum: infoArr?.length || 0,
      average,
      maxGrade,
    }
  },
  async byEmailModelGetGrade(options, cb = null) {
    const { email, model } = options
    return this.find({ email, model }).sort('-time').exec(cb)
  },
}
mongoose.model('Grade', GradeSchema)

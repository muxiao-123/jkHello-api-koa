/* eslint-disable func-names */
const mongoose = require('mongoose')

const { Schema } = mongoose
const QuestionSchema = new Schema({
  question: { type: String, default: '' },
  item1: { type: String, default: '' },
  item2: { type: String, default: '' },
  item3: { type: String, default: '' },
  item4: { type: String, default: '' },
  url: { type: String, default: '' },
  explains: { type: String, default: 0 },
  answer: { type: Number },
  real: { type: Boolean, default: true },
  id: { type: Number },
})
QuestionSchema.path('question').validate(function (question) {
  return question.length
}, 'question cannot be blank')

QuestionSchema.path('id').validate(function (id) {
  return id && typeof id === 'number'
}, 'id cannot be blank')

QuestionSchema.path('item1').validate(function (item1) {
  return item1.length
}, 'item1 cannot be blank')

QuestionSchema.path('item2').validate(function (item2) {
  return item2.length
}, 'item2 cannot be blank')

QuestionSchema.path('answer').validate(function (answer) {
  return answer.length
}, 'answer cannot be blank')

// pre-save hook
QuestionSchema.pre('save', function (next) {
  if (!this.isNew) {
    return next()
  }
  next()
})
// Methods
QuestionSchema.methods = {
  // todo
}
// Statics
QuestionSchema.statics = {
  // findByquestion(question, cb) {
  //   if (!question) {
  //     return {}
  //   }
  //   return this.find({}).exec(cb)
  // },
}
mongoose.model('Question', QuestionSchema)

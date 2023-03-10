const mongoose = require('mongoose')

const Question = mongoose.model('Question')

const addQuestion = async () => {
  // const questionInfo = {
  //   question: `58${random}5919这是${random}`,
  //   item1: 'ewqeqwe',
  //   item2: `fdsfs${randomA}dfdsf`,
  //   item3: 'fsdfds',
  //   item4: '秋名山老司机',
  //   answer: 1,
  //   url: '',
  //   explains: '这是解释',
  //   id: randomA,
  // }
  // const question = new Question(questionInfo)
  // const result = await question.save()
  // return result || null
  return null
}

const queryQuestion = async () => {
  const query = Question.find({})
  const result = await query.exec()
  // console.log(result)
  return result
}

module.exports = {
  addQuestion,
  queryQuestion,
}

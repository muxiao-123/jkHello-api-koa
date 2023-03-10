/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')
const { updateRank } = require('./rank')

const Grade = mongoose.model('Grade')
const Rank = mongoose.model('Rank')
const dealData = (info) => {
  const gradeInfo = {}
  gradeInfo.totalnum = Number(info.totalNum)
  gradeInfo.time = new Date(Number(info.time))
  gradeInfo.timepriod = Number(info.timepriod)
  gradeInfo.subject = Number(info.subject)
  gradeInfo.grade = Number(info.grade)
  gradeInfo.gradename = info.gradeName
  gradeInfo.model = info.model
  gradeInfo.email = info.email
  return { ...gradeInfo }
}
const getAverageInfo = async (options) => {
  const { email, model } = options
  const averageInfo = await Grade.getAverageInfo({
    email,
    model,
  })
  return { ...averageInfo }
}
const addGrade = async (info) => {
  const gradeInfo = dealData(info)
  const gradeModel = new Grade(gradeInfo)
  const result = await gradeModel.save()
  console.log('gradeInfo')
  console.log(gradeInfo)
  const averageInfo = await getAverageInfo({
    email: gradeInfo.email,
    model: gradeInfo.model,
  })
  console.log(averageInfo)
  const rankResult = await updateRank(averageInfo.maxGrade)
  const overComePer = await Rank.overCome(result)
  console.log(`rankResult::: ${rankResult}`)
  console.log(`overComePer::: ${overComePer}`)
  return {
    ...averageInfo,
    rankResult,
    maxGrade: averageInfo.maxGrade.grade,
    overCome: overComePer,
  }
}

// 通过邮箱 升序 降序，email/model, email/subject email/time
const queryGrade = async (options) => {
  const result = await Grade.byEmailModelGetGrade(options)
  // console.log(result)
  return result
}

// 多条增加
const createGrades = async (gradeArr) => {
  const result = await Grade.create(gradeArr)
  console.log(result)
  return result
}
// 最大值查找
const findMaxGrade = async () => {
  const email = '1510410642@qq.com'
  const result = await Grade.findMaxGrade(email)
  console.log(result)
  return result
}

module.exports = {
  addGrade,
  queryGrade,
  createGrades,
  findMaxGrade,
  getAverageInfo,
}

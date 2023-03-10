const mongoose = require('mongoose')

const Rank = mongoose.model('Rank')
const dealData = (info) => {
  const rankInfo = {}
  rankInfo.totalnum = Number(info.totalnum)
  rankInfo.time = new Date(Number(info.time))
  rankInfo.timepriod = Number(info.timepriod)
  rankInfo.subject = Number(info.subject)
  rankInfo.grade = Number(info.grade)
  rankInfo.gradename = info.gradename
  rankInfo.model = info.model
  rankInfo.email = info.email
  return { ...rankInfo }
}
const addRank = async (info) => {
  const rankInfo = dealData(info)
  const rank = new Rank(rankInfo)
  const result = await rank.save()
  return result
}

const queryRank = async (email) => {
  const result = await Rank.findOne({ email }).exec()
  return result
}

const query100Rank = async (email) => {
  const result = await Rank.getRank100()
  let rankInfo = null
  let index = -1
  if (email) {
    rankInfo = await queryRank(email)
  }
  if (rankInfo) {
    index = await Rank.byEmailGetIndex(email)
  }
  console.log(result)
  return { result, rankInfo, currentIndex: index }
}

const updateRank = async (rankInfo) => {
  const { email } = rankInfo
  const oldInfo = await Rank.findOne({ email }).exec()
  console.log(oldInfo)
  const newInfo = dealData(rankInfo)
  if (!oldInfo) {
    const result = await addRank(newInfo)
    console.log(result)
    console.log('old no data')
    return result
  }
  const result = await Rank.checkRankInfo(newInfo, oldInfo)
  return result
}

module.exports = {
  addRank,
  queryRank,
  query100Rank,
  updateRank,
}

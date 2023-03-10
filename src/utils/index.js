const generateCode = () => {
  const random = Math.floor((Math.random() + 0.1) * 1000000 - 100000)
  if (random < 100000) {
    return random * 10
  }
  return random
}

const getTimeName = () => {
  const currentTime = new Date()
  const [year, month, date] = [
    currentTime.getFullYear(),
    currentTime.getMonth() + 1,
    currentTime.getDate(),
  ]
  return `${year}${month}${date}`
}
module.exports = {
  generateCode,
  getTimeName,
}

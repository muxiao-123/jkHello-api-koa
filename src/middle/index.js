/* eslint-disable global-require */
// const initUserModel = require('../app/models/user')

const useModelInit = () => {
  require('../app/models/user')
  require('../app/models/grade')
  require('../app/models/rank')
  require('../app/models/question')
}
module.exports = {
  useModelInit,
}

/* eslint-disable no-unused-vars */
const {
  addUser,
  queryUser,
  updateUser,
  queryAllUser,
} = require('../app/controllers/user')
const {
  addGrade,
  queryGrade,
  queryAllGrade,
} = require('../app/controllers/grade')
const { addRank, queryRank, queryAllRank } = require('../app/controllers/rank')
const {
  addQuestion,
  queryQuestion,
  queryAllQuestion,
} = require('../app/controllers/question')
// const { checkTokenExpires } = require('../common/checkToken')
const { useSuccess } = require('../common/success')

// const addUserFn = async (ctx) => {

// }
const useTestUser = (router) => {
  router.get('/api/testuser', async (ctx) => {
    try {
      // const result = await addUser()
      const result = await addQuestion()
      console.log(result)
      useSuccess(ctx, { user: result })
    } catch (error) {
      useSuccess(ctx, { message: error.message })
    }
  })
}

const useUserRoute = (router) => {
  useTestUser(router)
}
module.exports = {
  useUserRoute,
}

/* eslint-disable no-unused-vars */
const { addQuestion, queryQuestion } = require('../app/controllers/question')
const { useError, useError401 } = require('../common/error')
const { checkTokenExpires } = require('../common/checkToken')
const { useSuccess } = require('../common/success')
// const { formHandle } = require('../common/useFormHandle')

const useAddQuestion = (router) => {
  router.post('/api/addQuestion', async (ctx) => {
    try {
      const { email } = ctx.state.user
      if (!email || email !== '582775919@qq.com') {
        useError401(ctx, '你没有权限添加问题', 'authorization')
        return
      }
      const hasThrough = checkTokenExpires(ctx)
      if (hasThrough) {
        return
      }
      // const result = await addQuestion()
      // console.log(result)
      useSuccess(ctx)
    } catch (error) {
      useError(ctx, error.responseCode || ctx.status, error.message)
    }
  })
}
const useGetQuestion = (router) => {
  router.get('/api/500Question', async (ctx) => {
    try {
      const hasThrough = checkTokenExpires(ctx)
      if (hasThrough) {
        return
      }
      const result = await queryQuestion()
      // console.log(result)
      useSuccess(ctx, { data: result })
    } catch (error) {
      useError(ctx, error.responseCode || ctx.status, error.message)
    }
  })
}

const useQuestionRoute = (router) => {
  useAddQuestion(router)
  useGetQuestion(router)
}
module.exports = {
  useQuestionRoute,
}

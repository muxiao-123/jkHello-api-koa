/* eslint-disable no-unused-vars */
const { addRank, queryRank, query100Rank } = require('../app/controllers/rank')
const { useError } = require('../common/error')
const { checkTokenExpires } = require('../common/checkToken')
const { useSuccess } = require('../common/success')
const { formHandle } = require('../common/useFormHandle')

const useAddRank = (router) => {
  router.post('/api/addRank', async (ctx) => {
    try {
      const hasThrough = checkTokenExpires(ctx)
      if (hasThrough) {
        return
      }
      const form = await formHandle(ctx)
      // const result = await addRank()
      // console.log(result)
      useSuccess(ctx, { data: form.fileds })
    } catch (error) {
      useError(ctx, error.responseCode || ctx.status, error.message)
    }
  })
}
const useGetRank100 = (router) => {
  router.get('/api/rank100', async (ctx) => {
    try {
      const { query } = ctx
      const result = await query100Rank(query.email || undefined)
      console.log(result)
      useSuccess(ctx, { data: result })
    } catch (error) {
      useError(ctx, error.responseCode || ctx.status, error.message)
    }
  })
}

const useRankRoute = (router) => {
  useAddRank(router)
  useGetRank100(router)
}
module.exports = {
  useRankRoute,
}

/* eslint-disable no-unused-vars */
const {
  addGrade,
  queryGrade,
  queryAllGrade,
  findMaxGrade,
  getAverageInfo,
} = require('../app/controllers/grade')
const { useError, useError400 } = require('../common/error')
const { checkTokenExpires } = require('../common/checkToken')
const { useSuccess } = require('../common/success')
const { formHandle } = require('../common/useFormHandle')

const useAddGrade = (router) => {
  router.post('/api/addGrade', async (ctx) => {
    try {
      const hasThrough = checkTokenExpires(ctx)
      if (hasThrough) {
        return
      }
      // console.log('com on addGrade')
      const form = await formHandle(ctx)
      const result = await addGrade(form.fileds)
      console.log(result)
      // console.log(form.fileds)
      useSuccess(ctx, { data: { grade: result } })
    } catch (error) {
      useError(ctx, error.responseCode || ctx.status, error.message)
    }
  })
}
const useQueryGrade = (router) => {
  router.post('/api/queryGrade', async (ctx) => {
    try {
      const hasThrough = checkTokenExpires(ctx)
      if (hasThrough) {
        return
      }
      const form = await formHandle(ctx)
      const options = form.fileds
      if (!options.email || !options.model) {
        return useError400(ctx, 'email or model is must')
      }
      const params = {
        email: options.email,
        model: options.model,
      }
      const result = await queryGrade(params)
      const averageInfo = await getAverageInfo(params)
      console.log('averageInfo')
      console.log(averageInfo)
      useSuccess(ctx, {
        data: {
          grade: result,
          average: {
            ...averageInfo,
            maxGrade: averageInfo.maxGrade.grade || 0,
          },
        },
      })
    } catch (error) {
      useError(ctx, error.responseCode || ctx.status, error.message)
    }
  })
}

const useGetAverageinfo = (router) => {
  router.post('/api/averageInfo', async (ctx) => {
    try {
      const hasThrough = checkTokenExpires(ctx)
      if (hasThrough) {
        return
      }
      const form = await formHandle(ctx)
      const options = form.fileds
      if (!options.email || !options.model) {
        return useError400(ctx, 'email or model is must')
      }
      const params = {
        email: options.email,
        model: options.model,
      }
      const averageInfo = await getAverageInfo(params)
      console.log(averageInfo)
      const maxGrade = averageInfo.maxGrade ? averageInfo.maxGrade.grade : 0
      useSuccess(ctx, { data: { average: { ...averageInfo, maxGrade } } })
    } catch (error) {
      useError(ctx, error.responseCode || ctx.status, error.message)
    }
  })
}

const useQueryMaxGrade = (router) => {
  router.get('/api/queryMaxGrade', async (ctx) => {
    try {
      const hasThrough = checkTokenExpires(ctx)
      if (hasThrough) {
        return
      }
      const result = await findMaxGrade()
      console.log(result)
      useSuccess(ctx, { data: result })
    } catch (error) {
      useError(ctx)
    }
  })
}

const useGradeRoute = (router) => {
  useAddGrade(router)
  useQueryGrade(router)
  useQueryMaxGrade(router)
  useGetAverageinfo(router)
}
module.exports = {
  useGradeRoute,
}

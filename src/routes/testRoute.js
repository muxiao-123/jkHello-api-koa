/* eslint-disable no-unused-vars */
const { checkTokenExpires } = require('../common/checkToken')
const { useSuccess } = require('../common/success')
const { addGrade, queryGrade } = require('../app/controllers/grade')
const { useError } = require('../common/error')

const useHome = (router) => {
  router.get('/api/home', (ctx) => {
    const hasThough = checkTokenExpires(ctx)
    if (!hasThough) {
      useSuccess(ctx, { data: { user: ctx.state.user } })
    }
  })
}
const useBase = (router) => {
  router.get('/', (ctx) => {
    ctx.body = 'hellow world'
  })
}
const useOther = (router) => {
  router.get('/api/other', (ctx) => {
    const hasThough = checkTokenExpires(ctx)
    if (!hasThough) {
      useSuccess(ctx, { data: { path: `${ctx.path}--${ctx.host}` } })
    }
  })
}

const useAddGrade = (router) => {
  router.get('/api/addGrade', async (ctx) => {
    try {
      // const result = await addGrade()
      const result = await queryGrade()
      // console.log(result)
      useSuccess(ctx, { data: result })
    } catch (error) {
      console.log(error)
      useError(ctx)
    }
  })
}

const useTestRoute = (router) => {
  useBase(router)
  useHome(router)
  useOther(router)
  useAddGrade(router)
}
module.exports = {
  useTestRoute,
}

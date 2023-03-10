const Router = require('koa-router')
const { useLoginRoute } = require('./loginRoute')
const { useTestRoute } = require('./testRoute')
const { useUserRoute } = require('./testuser')
const { useGradeRoute } = require('./gradeRoute')
const { useRankRoute } = require('./rankRouter')
const { useQuestionRoute } = require('./questionRoute')
const { useSuccess } = require('../common/success')

const router = new Router()
useLoginRoute(router)
useTestRoute(router)
useUserRoute(router)
useGradeRoute(router)
useRankRoute(router)
useQuestionRoute(router)
router.get('/getIP', async (ctx) => {
  // const ip =
  //   ctx.req.headers['x-real-ip'] ||
  //   ctx.req.headers['x-forwarded-for'] ||
  //   ctx.req.connection.remoteAddres ||
  //   ctx.req.socket.remoteAddress ||
  //   ''
  // console.log(ip)
  useSuccess(ctx)
})

module.exports = {
  router,
}

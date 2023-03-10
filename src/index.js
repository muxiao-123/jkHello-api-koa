const Koa = require('koa')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const jwt = require('koa-jwt')
const helmet = require('koa-helmet')
const logger = require('koa-logger')
const mongoose = require('mongoose')
const { dbUri } = require('./app/index')
const { useModelInit } = require('./middle/index')
// const requestIP = require('request-ip')

const { privateKey } = require('./utils/constant')

const app = new Koa()
console.log(app.env)

app.use(
  cors({
    allowMethods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
  }),
)
// app.use(requestIP.mw())
app.use(helmet())
app.use(require('koa-static')('static'))

app.use(bodyParser())
// 数据库模型初始化
// eslint-disable-next-line no-use-before-define
connect()
useModelInit()

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    if (error.status === 401) {
      ctx.type = 'application/json'
      ctx.status = error.status
      console.log(error)
      ctx.body = JSON.stringify({
        code: error.status,
        message: 'unauthorizied',
      })
    } else {
      console.log(error)
    }
  }
})
app.use(
  jwt({
    secret: privateKey,
    cookie: 'token',
    debug: true,
    issuer: 'http://yetim.cn/',
    audience: 'http://yetim.cn/jkhello/',
    getToken: (ctx) => {
      return ctx.header.authorization
    },
    // isRevoked: (ctx, decodeToken, token) => {
    //   console.log(decodeToken)
    //   console.log(token)
    //   console.log(ctx.state)
    //   return new Promise((resolve) => {
    //     resolve(false)
    //   })
    // },
  }).unless({
    path: [
      /^\/api\/login/,
      /^\/api\/sendCode/,
      /^\/api\/getIP/,
      /^\/api\/testuser/,
      /^\/api\/addGrade/,
      /^\/api\/rank100/,
    ],
  }),
)
const { router } = require('./routes')

app.use(router.routes())
app.use(router.allowedMethods())
app.use(
  logger((str, args) => {
    console.log(str)
    console.log(args)
  }),
)
const port = 3000
function listen() {
  app.listen(port, () => {
    console.log(`start: http://localhost:${port}/`)
  })
}

function connect() {
  mongoose.connection
    .on('error', console.log)
    .on('open', listen)
    .on('disconnected', connect)
  return mongoose.connect(dbUri, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // 针对findoneAndUpdate 返回旧数据
    useFindAndModify: false,
  })
}

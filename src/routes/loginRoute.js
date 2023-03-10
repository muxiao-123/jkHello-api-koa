const { existsSync, mkdirSync } = require('fs')
const { machineIdSync } = require('node-machine-id')
const { sign, verify } = require('jsonwebtoken')
const { checkTokenExpires } = require('../common/checkToken')
const { useError, useError400, useError401 } = require('../common/error')
const { useSuccess } = require('../common/success')
const { generateCode } = require('../utils/index')
const { addUser, queryUser, updateUser } = require('../app/controllers/user')
const {
  privateKey,
  maxAge,
  generateSignInfo,
  commonKey,
  baseUploadUrl,
  baseProject,
  baseUrl,
} = require('../utils/constant')
const { send } = require('../service/sendEmail')
const { formHandle } = require('../common/useFormHandle')
const { getTimeName } = require('../utils')

const useSendCode = (router) => {
  router.get('/api/sendCode', async (ctx) => {
    console.log(ctx.query)
    const { email } = ctx.query
    if (!email) {
      useError400(ctx)
      return
    }
    // const code = 123456 || generateCode()
    const code = generateCode()
    console.log(code)
    const subject = 'JKHELLO验证码'
    try {
      await send({ to: email, code, subject })
      const token = sign(
        {
          email,
          maxAge: 10 * 60 * 1000,
          time: Date.now(),
          code,
        },
        privateKey,
      )
      useSuccess(ctx, {
        data: { token },
      })
    } catch (error) {
      // console.log(error)
      useError(ctx, error.responseCode, '邮箱地址错误请重新查证')
    }
  })
}
const useLogin = (router) => {
  router.post('/api/login', async (ctx) => {
    try {
      const form = await formHandle(ctx)
      const { email, code } = form.fileds
      if (!email || !code) {
        useError400(ctx)
        return
      }
      const hasExpires = checkTokenExpires(ctx, email, code)
      if (hasExpires) {
        return
      }
      const queryResult = await queryUser(email)
      let signInfo = {
        email,
      }
      const initSign = (info) => {
        console.log(info.toObject())
        signInfo = { ...signInfo, ...info.toObject() }
      }
      if (queryResult.length >= 1) {
        initSign(queryResult[0])
      } else {
        const addResult = await addUser(email)
        if (addResult) {
          initSign(addResult)
        }
        // console.log(addResult)
      }
      const id = machineIdSync()
      console.log(id)
      const sessionToken = sign(
        {
          ...signInfo,
          maxAge,
          time: Date.now(),
          deviceId: id || commonKey,
          iss: 'http://yetim.cn/',
          aud: 'http://yetim.cn/jkhello/',
        },
        privateKey,
        {
          expiresIn: '2h',
        },
      )
      ctx.cookies.set('token', sessionToken, generateSignInfo(maxAge))
      useSuccess(ctx, {
        data: {
          token: sessionToken,
          deviceId: id || commonKey,
          userInfo: signInfo,
        },
      })
    } catch (error) {
      const { errors, message } = error
      const { properties } = errors.email
      useError400(
        ctx,
        properties?.message || message,
        properties?.path || 'error',
      )
    }
  })
}
const useAuth = (router) => {
  router.get('/api/auth', async (ctx) => {
    const { email } = ctx.query
    if (!email) {
      useError400(ctx)
      return
    }
    const token = ctx.header.authorization
    if (!token) {
      useError401(ctx)
      return
    }
    const payload = verify(token, privateKey)
    if (email !== payload.email) {
      useError401(ctx, 'token uvalid', 'token')
      return
    }
    const noExitKeys = ['exp', 'iat', 'time', 'deviceId', 'maxAge']
    const signInfo = Object.entries(payload).reduce((pre, cur) => {
      const [key, value] = cur
      if (!noExitKeys.includes(key)) {
        // eslint-disable-next-line no-param-reassign
        pre[key] = value
      }
      return pre
    }, {})
    console.log(signInfo)
    const sessionToken = sign(
      {
        ...signInfo,
        time: Date.now(),
      },
      privateKey,
    )
    ctx.cookies.set('token', sessionToken, generateSignInfo(signInfo.maxAge))
    useSuccess(ctx, {
      data: {
        token: sessionToken,
        deviceId: signInfo.deviceId,
        userInfo: signInfo,
      },
    })
    // ctx.body = ctx.state.user // 该中间件将验证后的用户数据直接返回给浏览器
  })
}
const useExit = (router) => {
  router.get('/api/exit', async (ctx) => {
    const token = ctx.header.authorization
    if (!token) {
      useError401(ctx)
      return
    }
    const payload = verify(token, privateKey)
    const sessionToken = sign(
      {
        email: payload.email,
        maxAge: 0,
        password: payload.password,
        time: Date.now(),
      },
      privateKey,
      {
        expiresIn: '2h',
      },
    )
    ctx.cookies.set('token', sessionToken, generateSignInfo(1))
    useSuccess(ctx, {
      data: {
        token: sessionToken,
        deviceId: payload.deviceId,
      },
    })
  })
}
const useUploadImage = (router) => {
  router.post('/api/uploadImage', async (ctx) => {
    try {
      const { email } = ctx.state.user
      if (!email) {
        useError401(ctx)
        return
      }
      const emailNum = email.split('@')[0]
      const completePath = `${baseUploadUrl}/${baseProject}/${emailNum}`
      if (!existsSync(completePath)) {
        mkdirSync(completePath)
      }
      const form = await formHandle(ctx, completePath, getTimeName())

      const hasThough = checkTokenExpires(ctx, form.fileds.email)
      if (hasThough) {
        return
      }
      const dbUrl = `${baseUrl}/${baseProject}/${emailNum}/${form.files.image.newFilename}`
      const updateResult = await updateUser(email, { url: dbUrl })
      useSuccess(ctx, {
        data: { url: updateResult.url },
      })
    } catch (error) {
      console.log(error)
      useError(ctx, error.responseCode, 'error')
    }
  })
}
const useLoginRoute = (router) => {
  useSendCode(router)
  useLogin(router)
  useAuth(router)
  useExit(router)
  useUploadImage(router)
}

module.exports = {
  useLoginRoute,
}

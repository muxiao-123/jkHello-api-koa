const { verify } = require('jsonwebtoken')
const { privateKey } = require('../utils/constant')
const { useError401, useError400 } = require('./error')
// token expires params
const checkToken = (payload) => {
  const { name, time } = payload
  console.log(name)
  return Date.now() - time < payload.maxAge
}
const checkTokenExpires = (ctx, email, code) => {
  const token = ctx.header.authorization
  if (!token) {
    useError401(ctx)
    return true
  }
  const payload = verify(token, privateKey)
  console.log(payload)
  if (!payload) {
    useError401(ctx)
    return true
  }
  if (email && payload.email !== email) {
    useError400(ctx, '前后邮箱信息不一致', 'params')
    return true
  }
  if (code && payload.code !== Number(code)) {
    useError400(ctx, '验证码信息不一致', 'params')
    return true
  }
  if (Date.now() - payload.time > payload.maxAge) {
    useError401(ctx, '认证信息失效,请重新验证', 'expires')
    return true
  }
  return false
}

module.exports = {
  checkToken,
  checkTokenExpires,
}

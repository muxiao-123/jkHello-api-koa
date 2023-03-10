const useError = (ctx, statusCode, message) => {
  if (statusCode) {
    ctx.status = statusCode
  }
  ctx.type = 'application/json'
  ctx.body = JSON.stringify({
    code: statusCode || ctx.status,
    message: message || 'error',
  })
}
const useError401 = (ctx, message, errorMessage) => {
  ctx.status = 401
  ctx.type = 'application/json'
  ctx.body = JSON.stringify({
    code: 401,
    error: errorMessage || 'token',
    message: message || 'noauthorized token expired',
  })
}
const useError400 = (ctx, message, errorMessage) => {
  ctx.status = 400
  ctx.type = 'application/json'
  console.log(ctx.statusText)
  ctx.body = JSON.stringify({
    code: 400,
    error: errorMessage || 'request',
    message: message || 'request params no exsit',
  })
}
module.exports = {
  useError,
  useError400,
  useError401,
}

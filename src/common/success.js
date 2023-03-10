const useSuccess = (ctx, data) => {
  ctx.type = 'application/json'
  const baseInfo = {
    code: ctx.status,
    message: 'success',
  }
  ctx.body = JSON.stringify(data ? { ...baseInfo, ...data } : baseInfo)
}
module.exports = {
  useSuccess,
}

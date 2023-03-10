const privateKey = 'jkolleh'
const commonKey = 'jkHello'
const maxAge = 3 * 60 * 60 * 1000
// const maxAge = 30 * 1000
const generateSignInfo = (_maxAge, expires) => {
  const time = Date.now() + 60 * 60 * 1000
  return {
    domain: 'localhost',
    path: '/',
    maxAge: _maxAge || maxAge,
    expires: new Date(expires || time),
    httpOnly: true,
    overwrite: true,
  }
}
// const baseUploadUrl = 'I:/serverph'
const baseUploadUrl = process.env.JK_STATIC_PATH
const baseProject = 'jkhello'
// const baseUrl = 'http://192.168.43.217'
const baseUrl = process.env.JK_STATIC_URL
module.exports = {
  privateKey,
  commonKey,
  maxAge,
  baseUploadUrl,
  baseProject,
  baseUrl,
  generateSignInfo,
}

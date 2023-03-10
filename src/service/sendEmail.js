const NodeMailer = require('nodemailer')

const createHtml = (email, code) => {
  return `<p><strong>\\(@^0^@)/</strong><p/>
  <p>Hello!<strong>${email}</strong></p>
  <p>欢迎登录<strong>JKHELLO</strong></p>
  <p>这是你的邮箱验证码：<strong>${code}</strong></p>
  <p>有效时长为10分钟</p>
  <p>本邮件为自动发送，请勿回复。谢谢你！</p>`
}
const info = {
  from: '582775919@qq.com', // sender address
  to: '1510410642@qq.com', // list of receivers
  subject: 'Hello ✔', // Subject line
  text: 'Hello world?', // plain text body
  html: '<b>Hello world?</b>', // html body
}
async function send(options) {
  const { to, subject, code } = options
  const html = createHtml(to, code)
  // eslint-disable-next-line prefer-object-spread
  const htmlText = Object.assign({}, info, { to, subject, html })
  // console.log(htmlText)
  const authInfo = {
    user: '582775919@qq.com',
    pass: 'cxnrbjikfplwbcij', // 授权码
  }

  // create reusable transporter object using the default SMTP transport
  const transporter = NodeMailer.createTransport({
    // host: 'smtp.ethereal.email',
    // port: 587,
    // secure: false, // true for 465, false for other ports
    service: 'qq',
    secure: true,
    auth: {
      type: 'login',
      user: authInfo.user,
      pass: authInfo.pass,
    },
  })

  // console.log('Preview URL: %s', NodeMailer.getTestMessageUrl(info))
  try {
    // const emailInfo =
    // console.log(emailInfo)
    return await transporter.sendMail(htmlText)
  } catch (error) {
    return Promise.reject(error)
  }
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
}

module.exports = {
  send,
}

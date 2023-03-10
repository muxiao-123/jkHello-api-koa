const formidable = require('formidable')
const path = require('path')

const formHandle = (ctx, dir, filename) => {
  const filenameFn = filename ? () => `${filename}.png` : undefined
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      uploadDir: dir ? path.resolve(dir) : path.resolve(__dirname, '../upload'),
      // keepExtensions: true,
      filename: filenameFn,
    })
    form.parse(ctx.req, (err, fileds, files) => {
      if (err) {
        reject(err)
      } else {
        resolve({ fileds, files })
      }
    })
  })
}

module.exports = {
  formHandle,
}

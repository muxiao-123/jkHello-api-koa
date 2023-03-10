1. koa-router
作为koa星数最多的中间件，koa-router提供了全面的路由功能

2. koa-bodyparser
解析请求体时需要加载额外的中间件 支持x-www-form-urlencoded, application/json等格式的请求体
form-data的请求体，需要借助 formidable 这个库

3. koa-static
在本地开发时特别方便，可用于加载前端文件或后端Fake数据

4. koa-session
HTTP是无状态协议，为了保持用户状态，我们一般使用Session会话

5. koa-jwt
随着网站前后端分离方案的流行，越来越多的网站从Session Base转为使用Token Base
JWT(Json Web Tokens)作为一个开放的标准被很多网站采用，koa-jwt这个中间件使用JWT认证HTTP请求

6. koa-helmet
网络安全得到越来越多的重视，helmet 通过增加如Strict-Transport-Security, 
X-Frame-Options, X-Frame-Options等HTTP头提高Express应用程序的安全性

7. koa-logger
koa-logger提供了输出请求日志的功能
8. @koa/cors
跨域设置库

- nginx 设置 代理供获取ip使用
```js
const ip = req.headers['x-real-ip'] ||
req.headers['x-forwarded-for'] ||
req.connection.remoteAddres ||
req.socket.remoteAddress ||
```
```conf
location / {
  proxy_pass   http://localhost:3000;
  proxy_redirect off;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header Host $http_host;
  proxy_set_header X-NginX-Proxy true;
}
```
### 接口说明

### login
1. sendCode
```js
{
  params: false,
  token: false,
  uri: '/api/sendCode',
  method: 'get',
  response: { code: 404, data: { token }, message }
}
```
2. login
```js
{
  params: { email, code },
  paramsType: new FormData,
  token: true,
  uri: '/api/login',
  method: 'post',
  response: { code: 404, data: { token, deviceId, userInfo }, message }
}
```
3. auth
```js
{
  params: { email },
  token: true,
  uri: '/api/auth',
  method: 'get',
  response: { code: 404, data: { token, deviceId, userInfo }, message }
}
```
4. exit
```js
{
  token: true,
  uri: '/api/exit',
  method: 'get',
  response: { code: 404, data: { token, deviceId }, message }
}
```
5. uploadImage
```js
{
  params: { email, image: Blob, type: 'image/*' },
  paramsType: new FormData(),
  token: true,
  uri: '/api/uploadImage',
  method: 'post',
  response: { code: 404, data: { url }, message }
}
```
### grade
1. addGrade
```js
{
  params: { GradeType },
  paramsType: new FormData(),
  token: true,
  uri: '/api/addGrade',
  method: 'post',
  response: { code: 404, data: { gradeInfo? }, message }
}
```
2. queryGrade
```js
{
  params: { email, model?, subject? },
  token: true,
  uri: '/api/queryGrade',
  method: 'get',
  response: { code: 404, data: { gradeInfo: GradeInfo[] }, message }
}
```
3. queryMaxGrade
```js
{
  params: { email },
  token: true,
  uri: '/api/queryMaxGrade',
  method: 'get',
  response: { code: 404, data: { gradeInfo }, message }
}
```
### rank
1. addRank
```js
{
  params: { RankType },
  paramsType: new FormData(),
  token: true,
  uri: '/api/addRank',
  method: 'post',
  response: { code: 404, data: { RankInfo? }, message }
}
```
2. rank100
```js
{
  token: flase,
  uri: '/api/rank100',
  method: 'get',
  response: { code: 404, data: { RankInfo: RankInfo[] | [] }, message }
}
```
### question
1. addQuestion
```js
{
  params: { QuestionType },
  role: 100,
  paramsType: new FormData(),
  token: true,
  uri: '/api/addQuestion',
  method: 'post',
  response: { code: 404, message }
}
```
2. 500Question
```js
{
  role: 50,
  token: true,
  uri: '/api/500Question',
  method: 'get',
  response: { code: 404,dara: { question: [] },  message }
}
```

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const { expressjwt: jwt } = require('express-jwt')
const { jwtSecretKey } = require('./config/jwtSecretKey')
const DB = require('./config/sequelize')
// 启用 cors
app.use(cors())

// 解析json数据格式
app.use(bodyParser.json())

// 解析urlencoded数据格式
app.use(bodyParser.urlencoded({ extended: false }))

// 用户认证中间件
app.use(jwt({ secret: jwtSecretKey, algorithms: ['HS256'] }).unless({
    // 不需要认证的接口
    path: [
        /^\/api\/user\/v1\/register/,
        /^\/api\/notify\/v1\/captcha/,
        /^\/api\/notify\/v1\/sendCode/,
        /^\/api\/wechatLogin\/v1/,
    ]
}))

// 通知相关的接口
const notifyRouter = require('./router/notify.js')
app.use('/api/notify/v1', notifyRouter)

// 用户相关的接口
const userRouter = require('./router/user.js')
app.use('/api/user/v1', userRouter)

// 用户相关的接口
const wechatLoginRouter = require('./router/wechatLogin.js')
app.use('/api/wechatLogin/v1', wechatLoginRouter)


// 错误中间件
app.use((err, req, res, next) => {
    // 未登录的错误
    if (err.name === 'UnauthorizedError') {
        return res.send({ code: -1, data: null, msg: '请先登录！' })
    }
    // 其他的错误
    res.send({ code: -1, data: null, msg: err.message })
})


app.listen(8081, () => {
    console.log('服务启动在：http://127.0.0.1:8081')
})
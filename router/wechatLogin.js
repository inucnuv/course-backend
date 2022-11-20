const express = require('express')
const router = express.Router()


const WechatLoginController = require('../controller/WechatLoginController.js')

// 微信回调
router.get('/callback',WechatLoginController.wechatInsert)

// 获取二维码接口
router.get('/login', WechatLoginController.login)

// 微信回调发送用户信息
router.post('/callback', WechatLoginController.wechatMessage)

// 轮询用户是否扫码
router.get('/checkScan', WechatLoginController.checkScan)


module.exports = router
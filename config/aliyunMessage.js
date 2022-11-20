const { axios } = require('axios')

const sendMsgCode = (phone, randomCode) => {
    console.log('发送短信 手机号 : {} ,验证码 : {}',phone,randomCode)
    return "OK"
}

module.exports = sendMsgCode
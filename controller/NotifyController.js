
const NotifyService = require('../service/NotifyService.js')

const GetUserInfoTool = require('../utils/GetUserInfoTool')
const SecretTool = require('../utils/SecretTool')
const RanDomTool = require('../utils/RandomTool')


const getKey = (req) => {
    return SecretTool.md5(GetUserInfoTool.getIp(req) + GetUserInfoTool.getUserAgent(req))
}

const NotifyController = {
    /**
     * 获取图形验证码
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    captcha: async (req,   res) => {
        let {type} = req.query
        let handleRes = await NotifyService.captcha(getKey(req),type)
        res.set('content-type', 'image/svg+xml')
        res.send(handleRes)
    },
    /**
     * 发送短信验证码
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    sendCode: async (req,res) => {
        let {phone, captcha, type} = req.body
        let _key = getKey(req)
        let handleRes = await NotifyService.sendCode(phone, captcha, type, _key, RanDomTool.randomCode())
        return res.send(handleRes)
    }
}


module.exports = NotifyController
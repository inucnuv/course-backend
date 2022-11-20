
const WechatLoginService = require('../service/WechatLoginService')

const WechatLoginController = {
    /**
     * 验证
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    wechatInsert:  (req,res) => {
        // 从微信服务器拿对称加密的参数
        let { signature, timestamp, nonce, echostr } = req.query
        let handleRes =  WechatLoginService.wechatInsert(signature, timestamp, nonce, echostr)
        res.send(handleRes)
    },
    login: async (req, res) => {
        let handleRes = await WechatLoginService.login()
        res.send(handleRes)
    },
    wechatMessage: async (req, res) => {
        let handleRes = await WechatLoginService.wechat_message(req)
        res.send(handleRes)
    },
    checkScan: async (req, res) => {
        let handleRes = await WechatLoginService.check_scan(req)
        res.send(handleRes)
    }
}

module.exports = WechatLoginController
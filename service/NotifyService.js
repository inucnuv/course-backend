
const svgCaptcha = require('svg-captcha')
const redis = require('../config/redisConfig.js')
const dayjs = require('dayjs')
const aliyunMessage = require('../config/aliyunMessage')
const BackCode = require('../utils/BackCode')
const CodeEnum = require('../utils/CodeEnum')


const NotifyService = {
    /**
     * 生成图形验证码
     * @param key 图形验证码的key
     * @param type 图形验证码的类型
     * @returns {Promise<string>}
     */
    captcha: async (key,type) => {
        // 生成图形验证码
         let captcha = svgCaptcha.create({
             // 长度
             size: 4,
             // 过滤的字符串
             ignoreChars: '0o1i',
             // 干扰横线数量
             noise: 1,
             // 背景颜色
             background: '#aaaaaa'
         })
        redis.set(`${type}:captcha:${key}`,captcha.text,60*5)
        return captcha.data
    },
    /**
     * 发送短信验证码
     * @param phone 手机号
     * @param captcha 图形验证码
     * @param type  类型
     * @param key 图形验证码的key
     * @param randomCode 短信验证码
     * @returns {Promise<{msg: string, code: number}|{msg: *, code: *, data: *}>}
     */
    sendCode: async  (phone, captcha, type, key, randomCode) => {
        // 判断短信验证码是否存在,  截取时间戳 , 60秒之内不能重复获取验证码
        if (await redis.exists(`${type}:code:${phone}`)){
            // dayjs 是第三方插件
            let dateRedis = dayjs(Number((await redis.get(`${type}:code:${phone}`)).split('_')[0]))
            if (dayjs(Date.now()).diff(dateRedis, 'second') <= 60) {
                return BackCode.buildResult(CodeEnum.CODE_LIMITED)
            }
        }
        // 判断图形验证码是否存在
        if (!await redis.exists(`${type}:captcha:${key}`)){
            return BackCode.buildResult(CodeEnum.CODE_SEND)
        }
        if (!captcha){
            return BackCode.buildError('缺少 captcha参数')
        }
        // 判断验证码对不对
        let captchaRedis = await redis.get(`${type}:captcha:${key}`)
        if (!(captchaRedis.toLowerCase() === captcha.toLowerCase())){
            return BackCode.buildResult(CodeEnum.CODE_ERROR)
        }

        // 发送短信
        let codeRes = aliyunMessage(phone,randomCode)

        // 保存短信验证码到Redis, 为时间戳 + _ + 短信验证码,
        let randomCodeTime = `${Date.now()}_${randomCode}`
        await redis.set(`${type}:code:${phone}`,randomCodeTime,600)

        // 删除验证码缓存
        await redis.del(`${type}:captcha:${key}`)
        if (codeRes === 'OK'){
            return BackCode.buildSuccessAndMsg( '发送成功')
        }else {
            return BackCode.buildError( '发送失败')
        }
    }

}

module.exports = NotifyService
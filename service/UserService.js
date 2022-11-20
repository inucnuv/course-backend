
const DB = require('../config/sequelize')
const redis = require('../config/redisConfig')
const RandomTool = require('../utils/RandomTool')
const SecretTool = require('../utils/SecretTool')
const BackCode = require('../utils/BackCode')
const CodeEnum = require('../utils/CodeEnum')

const UserService = {
    /**
     * 用户注册
     * @param phone 注册的手机号
     * @param code 短信验证码
     * @returns {Promise<{msg: *, code: *, data: *}>}
     */
    register: async (phone, code) => {
        // 查询手机号是否注册
        // let existPhone = await DB.Account.findAll({where: phone})
        let existPhone = await DB.Account.findAll({ where: { phone } })
        if (existPhone.length > 0) {
            return BackCode.buildResult(CodeEnum.ACCOUNT_REPEAT)
        }

        // 判断验证码是否正确
        if (await redis.exists(`register:code:${phone}`)){

            let redisCode = (await redis.get(`register:code:${phone}`)).split('_')[1]
            console.log(redisCode)
            console.log(code)
            if (redisCode !== code){
                return BackCode.buildError('手机验证码不正确')
            }
        }else {
            return BackCode.buildError('请先获取手机验证码')
        }

        redis.del(`register:code:${phone}`)

        // 生成用户信息
        let avatar = RandomTool.randomAvatar()
        let name = RandomTool.randomName()

        // 生成token
        let user = {avatar,name,phone}
        let token = SecretTool.jwtSign(user,'168h')

        // 用户入库
        await DB.Account.create({username: name,head_img: avatar,  phone: phone})



        return BackCode.buildSuccessAndData(`Bearer ${token}`)

    }
}


module.exports = UserService
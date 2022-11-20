
const UserService = require('../service/UserService')

const UserController = {
    /**
     * 用户注册
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    register: async (req,res) => {
        let {phone, code} = req.body
        let handleRes = await UserService.register(phone, code)
        res.send(handleRes)
    }
}

module.exports = UserController
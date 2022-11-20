class GetUserInfoTool{
    /**
     * 获取用户的IP
     * @param req
     * @returns {string}
     */
    static getIp(req) {
        return req.ip.match(/\d+.\d+.\d+.\d+/).join('.')
    }

    /**
     * 获取用户的浏览器标识
     * @param req
     * @returns {*}
     */
    static getUserAgent(req) {
        return req.headers['user-agent']
    }
}

module.exports = GetUserInfoTool
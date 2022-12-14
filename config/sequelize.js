const { Sequelize } = require('sequelize')
const initModels = require('../models/init-models')

const sequelize = new Sequelize('node', 'root', '12345678', {
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+08:00'
});

(async function () {
    try {
        await sequelize.authenticate()
        console.log('数据库链接成功')
    } catch (error) {
        console.log('数据库链接失败：', error)
    }
})()


const models = initModels(sequelize)

module.exports = { ...models, sequelize }
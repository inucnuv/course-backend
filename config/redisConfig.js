
const Redis = require('ioredis')

const redis = new Redis({
    port: 6379,
    host: '127.0.0.1',
    password: '10mz@QP01!'
})

const redisConfig = {
    // redis存数据
     set:(key,value,time)=> {
         time ? redis.set(key,value,'EX',time) : redis.set(key,value)
     },
    // redis获取数据
    get:(key)=> {
        return redis.get(key)
    },
    // Redis 删除
    del:(key) => {
         return redis.del(key)
    },

    // 判断 key 存不存在
    exists: (key) => {
         return redis.exists(key)
    }

}

module.exports = redisConfig
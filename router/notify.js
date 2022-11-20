const express = require('express')
const router = express.Router()


const NotifyController = require('../controller/NotifyController.js')

router.get('/captcha',NotifyController.captcha)
router.post('/sendCode',NotifyController.sendCode)

module.exports = router
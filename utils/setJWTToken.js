/*
 * @Author: Yin Xiang Zheng
 * @LastEditors: Yin Xiang Zheng
 * @LastEditTime: 2020-08-10 10:15:22
 */
const jwt = require('jsonwebtoken');
const config = require('../config/config');
module.exports = {
    getToken(user) {
        const token = jwt.sign({
            username: user.username,
            phone: user.phone,
            role: user.role,
            _id: user._id,
        }, config.jwtSecret);
        return token
    },
    setUserInfo(user) {
        return {
            username: user.username,
            phone: user.phone,
            email: user.email,
            role: user.role,
            _id: user._id,
        }
    }
}
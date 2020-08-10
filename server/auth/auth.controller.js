/*
 * @Author: your name
 * @Date: 2020-06-27 10:07:57
 * @LastEditTime: 2020-08-10 10:15:50
 * @LastEditors: Yin Xiang Zheng
 * @Description: In User Settings Edit
 * @FilePath: /express-mongoose-es6-rest-api/server/auth/auth.controller.js
 */

const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const crypto = require('crypto');
const User = require('../user/user.model');
const { getToken, setUserInfo } = require('../../utils/setJWTToken');

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity

  User.getByPhone(req.body.phone)
    .then((user) => {
      // 加盐密码的md5值
      const sha256 = crypto.createHash('sha256');
      const sha256ed = sha256.update(`${req.body.password}${config.saltStr}${user.username}`).digest('hex');
      req.user = user; // eslint-disable-line no-param-reassign
      if (req.body.phone === user.phone && sha256ed === user.pwd) {
        const token = getToken(user)
        const userInfo = setUserInfo(user)
        return res.json({ token, userInfo });
      }
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
      return next(err);
    })
    .catch((e) => {
      const err = new APIError(httpStatus.INTERNAL_SERVER_ERROR, e, true);
      next(err);
    });
}


module.exports = { login };

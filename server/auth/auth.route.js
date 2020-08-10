/*
 * @Author: Yin Xiang Zheng
 * @LastEditors: Yin Xiang Zheng
 * @LastEditTime: 2020-07-06 16:55:57
 */
const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const authCtrl = require('./auth.controller');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

module.exports = router;

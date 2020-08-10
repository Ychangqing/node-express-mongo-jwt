/*
 * @Author: your name
 * @Date: 2020-06-27 10:07:57
 * @LastEditTime: 2020-07-25 17:24:01
 * @LastEditors: Yin Xiang Zheng
 * @Description: In User Settings Edit
 * @FilePath: /express-mongoose-es6-rest-api/server/user/user.route.js
 */
const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const userCtrl = require('./user.controller');
const User = require('./user.model');
const paginationMiddleware = require('../../middleware/pagination');
const { hasRole } = require('../../middleware/auth');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(hasRole('admin'), paginationMiddleware(User, ['username'], [{ username: 'a' }]), userCtrl.list)
  .post(hasRole('admin'), validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  .get(hasRole('admin'), userCtrl.get)
  .put(hasRole('admin'), validate(paramValidation.updateUser), userCtrl.update)
  .delete(hasRole('admin'), userCtrl.remove);

router.route('/:userId/update/userInfo')
  .put(hasRole('user'), userCtrl.updateUserInfo)

router.param('userId', userCtrl.load);

module.exports = router;

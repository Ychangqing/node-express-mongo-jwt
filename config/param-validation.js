/*
 * @Author: your name
 * @Date: 2020-06-27 10:07:57
 * @LastEditTime: 2020-08-10 11:33:08
 * @LastEditors: Yin Xiang Zheng
 * @Description: In User Settings Edit
 * @FilePath: /express-mongoose-es6-rest-api/config/param-validation.js
 */
const Joi = require('joi');

module.exports = {
  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string(),
      phone: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      phone: Joi.string().required(),
      pwd: Joi.string().required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      phone: Joi.string().required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },
};

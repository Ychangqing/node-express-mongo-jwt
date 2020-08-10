/*
 * @Author: your name
 * @Date: 2020-06-27 10:07:57
 * @LastEditTime: 2020-08-10 11:32:28
 * @LastEditors: Yin Xiang Zheng
 * @Description: In User Settings Edit
 * @FilePath: /express-mongoose-es6-rest-api/server/user/user.controller.js
 */
const User = require('./user.model');
const crypto = require('crypto');
const config = require('../../config/config');
const { setUserInfo } = require('../../utils/setJWTToken');


/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.phone - The phone of user.
 * @returns {User}
 */
function create(req, res, next) {
  const sha256 = crypto.createHash('sha256');
  const pwd = sha256.update(`${req.body.pwd}${config.saltStr}${req.body.username}`).digest('hex');
  const user = new User({
    username: req.body.username,
    phone: req.body.phone,
    pwd,
    role: 'user',
  });
  if (res) {
    user.save()
      .then(savedUser => res.json(savedUser))
      .catch(e => next(e));
  } else {
    return user.save()
  }
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.phone - The phone of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.phone = req.body.phone;


  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { total, pages, pageNo, pageSize, list } = res
  res.json({ total, pages, pageNo, pageSize, list })
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

function getUserWithIds(req, res, next) {
  const { total, pages, pageNo, pageSize, list } = res
  res.json({ total, pages, pageNo, pageSize, list })
}

function getUserWithPhoneFn(phone) {
  return User.find(phone).lean().exec()
}

function updateUserInfo(req, res, next) {
  const { userId } = req.params
  const { email } = req.body
  User.update({ _id: userId }, { email }).lean().exec().then(saved => {
    User.get(userId)
      .then((user) => {
        const userInfo = setUserInfo(user)
        res.json({ userInfo })
      })
      .catch(e => next(e));
  }).catch(err => {
    next(err)
  })
}

module.exports = { load, get, create, update, list, remove, getUserWithIds, getUserWithPhoneFn, updateUserInfo };

/*
 * @Author: Yin Xiang Zheng
 * @LastEditors: Yin Xiang Zheng
 * @LastEditTime: 2020-07-05 23:20:18
 */
'use strict';

var compose = require('composable-middleware');
const config = require('../config/config.js');
const expressJwt = require('express-jwt');

/** 
 * 验证token
 */
function authToken(credentialsRequired) {
    return compose()
        .use(expressJwt({
            secret: config.jwtSecret,
            credentialsRequired: true //是否抛出错误
        }))
}

/**
 * 验证用户是否登录
 */
function isAuthenticated() {
    return compose()
        .use(authToken(true))
        .use(function (err, req, res, next) {
            //expressJwt 错误处理中间件
            if (err.name === 'UnauthorizedError') {
                return res.status(401).send();
            }
            next();
        })
}

/**
 * 验证用户权限
 */
function hasRole(roleRequired) {
    if (!roleRequired) throw new Error('Required role needs to be set');

    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                next();
            }
            else {
                return res.status(403).send();
            }
        });
}




exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
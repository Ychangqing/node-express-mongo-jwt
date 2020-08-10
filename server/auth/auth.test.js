/*
 * @Author: Yin Xiang Zheng
 * @LastEditors: Yin Xiang Zheng
 * @LastEditTime: 2020-08-10 11:38:23
 */
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');
const config = require('../../config/config');

chai.config.includeStack = true;

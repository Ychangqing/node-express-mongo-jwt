/*
 * @Date: 2020-06-27 10:07:57
 * @LastEditTime: 2020-08-10 11:33:56
 * @LastEditors: Yin Xiang Zheng
 */
const express = require('express');
const authRoutes = require('./server/auth/auth.route');
const router = express.Router(); // eslint-disable-line new-cap


// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount auth routes at /auth
router.use('/auth', authRoutes);



module.exports = router;

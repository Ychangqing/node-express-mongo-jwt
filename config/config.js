/*
 * @Author: your name
 * @Date: 2020-06-27 10:07:57
 * @LastEditTime: 2020-08-10 10:15:14
 * @LastEditors: Yin Xiang Zheng
 * @Description: In User Settings Edit
 * @FilePath: /risk-warning-app/config/config.js
 */
const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(5000),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false)
    }),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  MONGO_HOST: Joi.string().required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number()
    .default(27017),
  SALT_STR: Joi.string().required(),
}).unknown()
  .required();


const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  saltStr: envVars.SALT_STR,
  userRoles: ['user', 'admin'],
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT
  },
};

module.exports = config;

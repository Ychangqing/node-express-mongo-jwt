/*
 * @Author: Yin Xiang Zheng
 * @LastEditors: Yin Xiang Zheng
 * @LastEditTime: 2020-07-22 17:38:41
 */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable radix */

const httpStatus = require('http-status');
const isArray = require('lodash/isArray')
const isEmpty = require('lodash/isEmpty')

/**
 * regField： 模糊查询的值
 * anyField： 精确查询的值
 */
exports = module.exports = function (Schema, regField, anyField, populate, filterField) {
    if (!Schema) throw new Error('Please provide a Schema');
    return function (req, res, next) {
        try {
            const pageNo = parseInt(req.query.pageNo) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;

            if (pageNo < 0 || pageNo === 0) {
                return res.status(422).send({
                    message: 'invalid page number, should start with 1',
                });
            }
            const skipBy = pageSize * (pageNo - 1);

            const { selQuery = {}, selSort = { createdAt: -1 } } = getSelQuery(req, regField, anyField)

            console.log(selQuery, req.query);
            Schema.find(selQuery, filterField || {}).populate(populate || '').sort(selSort).skip(skipBy).limit(pageSize).exec()
                .then((list) => {
                    Schema.count({}, (err, count) => {
                        if (err) {
                            return res.status(500).send({
                                message: err.message,
                            });
                        }
                        const totalPages = Math.ceil(count / pageSize);
                        const hasMore = pageNo * pageSize < count
                        Object.assign(res, { total: count, pages: totalPages, pageNo: pageNo, pageSize: pageSize, list, hasMore });
                        next();
                    });
                }).catch(error => {
                    console.log(error);
                })
        } catch (err) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                message: err.message,
            });
        }
    };
};

/**
  * Get user
  * @param {regField} array - 模糊查询的值
  * @param {anyField} array - 精确查询的值
  * @returns {Promise<User, APIError>}
  */
function getSelQuery(req, regField, anyField) {
    // pageNo pageSize
    // queryValue 是模糊查询
    // sortBies: [{field: 'name', asc: 0/1}]
    // 其他字段都是高级查询

    // query['name']=new RegExp(req.query.m2);//模糊查询参数


    const reqQuery = req.query
    const selQuery = { '$or': [] }
    let selSort = {}
    if (isArray(regField) && regField.length > 0) {
        for (const iterator of regField) {
            selQuery['$or'].push({ [iterator]: new RegExp(reqQuery.queryValue) }); //模糊查询参数
        }
    }

    if (isArray(anyField) && anyField.length > 0) {
        for (const iterator of anyField) {
            if (!isEmpty(reqQuery[iterator]))
                selQuery[iterator] = reqQuery[iterator]
        }
    }

    const { sortBies } = reqQuery
    if (isArray(sortBies) && sortBies.length > 0) {
        for (const iterator of sortBies) {
            let parse = iterator
            try {
                parse = JSON.parse(iterator)
            } catch (error) {
            }
            selSort[parse.field] = parse.asc === 0 ? -1 : 1
        }
    }

    return { selQuery, selSort }

}

/*
 * @Author: Yin Xiang Zheng
 * @LastEditors: Yin Xiang Zheng
 * @LastEditTime: 2020-08-10 10:08:48
 */
exports.getFields = (arrayOfObject, key) => {
    let output = [];
    for (let i = 0; i < arrayOfObject.length; ++i)
        output.push(arrayOfObject[i][key]);
    return output;
}
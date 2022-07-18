"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var isProd = process.env.NODE_ENV === 'production';
function parseEnv() {
    var localEnv = path.resolve('.env');
    var prodEnv = path.resolve('.env.prod');
    if (!fs.existsSync(localEnv) && !fs.existsSync(prodEnv)) {
        throw new Error('缺少环境配置文件');
    }
    var filePath = isProd && fs.existsSync(prodEnv) ? prodEnv : localEnv;
    return { path: filePath };
}
exports["default"] = parseEnv();

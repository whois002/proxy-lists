/**
 * speedCheck.js Created by wangjia on 2017-6-30.
 */
'use strict';

var request = require('request');
var async = require('async');
var _ = require('underscore');

var defaultOptions = {
    site: 'www.baidu.com',
    siteContent: null,
    protocol: 'http',
    method: 'get'
}


module.exports = function (proxys, options) {
    options = _.extend({}, defaultOptions, options || {});

    var asyncMethod = options.series === true ? 'eachSeries' : 'each';
    var option = {
        method: options.method,
        uri: options.protocol + '://' + options.site,
        // proxy: protocol + '://' + proxy.ipAddress + proxy.port,
    };
    async[asyncMethod](proxys, function (proxy, next) {
        option.proxy = options.protocol + '://' + proxy.ipAddress + ":" + proxy.port;
        var startTime = new Date().getTime();
        console.log('speedcheck', option);
        request(option, function (err, response, body) {
            console.log('error', err, response);
                proxy.isSuccess = !err && response.statusCode === 200;
                if (proxy.isSuccess) {
                    proxy.isSuccess = !body || option.siteContent === body;
                    if (proxy.isSuccess) {
                        var endTime = new Date().getTime();
                        proxy.speed = endTime - startTime;
                    }
                }
                else {
                    proxy.speed = null;
                }
            }
        );

    }, function () {

    });
}
/**
 * speedCheck.js Created by wangjia on 2017-6-30.
 */
'use strict';

var request = require('request');
var async = require('async');
var _ = require('underscore');

var defaultOptions = {
    site: 'www.smzdm.com',
    siteContent: null,
    protocol: 'http',
    method: 'get',
    timeout: 10000
}


module.exports = function (proxys, options, callback) {
    options = _.extend({}, defaultOptions, options || {});

    var asyncMethod = options.series === true ? 'eachSeries' : 'each';
    var option = {
        method: options.method,
        uri: options.protocol + '://' + options.site,
        timeout: options.timeout
        // proxy: protocol + '://' + proxy.ipAddress + proxy.port,
    };
    async[asyncMethod](proxys, function (proxy, next) {
        option.proxy = options.protocol + '://' + proxy.ipAddress + ":" + proxy.port;
        var startTime = new Date().getTime();
        // console.log('speedcheck', option);
        request(option, function (err, response, body) {
                if (err)
                    console.log('error-', err);
                else
                    console.log('response.statusCode', response.statusCode);
                proxy.isSuccess = !err && response.statusCode === 200;
                if (proxy.isSuccess) {
                    proxy.isSuccess = !option.siteContent || option.siteContent === body;
                    if (proxy.isSuccess) {
                        var endTime = new Date().getTime();
                        proxy.speed = endTime - startTime;
                    }
                }
                else {
                    proxy.speed = null;
                }
                next();
            }
        );

    }, function () {
        console.log('speedcheck proxies ' + proxys.length);
        callback(proxys);
    });
}
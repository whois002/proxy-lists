/**
 * Created by wangjia on 2017-6-28.
 */
var request = require('request');

request({
        // will be ignored
        method: 'GET',
        uri: 'http://www.baidu.com',
        proxy:'http://1.82.216.134:80',
        // timeout:20000
    }, function (err, response, body) {
        if (err)
            console.log(err);
        else
            console.log(response);
    }
);

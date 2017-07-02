/**
 * Created by wangjia on 2017-6-28.
 */
var request = require('request');

request({
        // will be ignored
        method: 'GET',
        uri: 'http://www.smzdm.com',
        proxy:'http://183.62.71.242:3128',
        timeout:10000
    }, function (err, response, body) {
        if (err)
            console.log(err);
        else
        {
            console.log(response.statusCode);
            // console.log(body);
        }
    }
);

/**
 * Created by wangjia on 2017-6-28.
 */
var ProxyLists = require('../../index.js');

var options = {
    countries: null,
    sample: true,
    protocols: ['http', 'https'],
    speedCheck: true,
    /*
     Anonymity level.

     To get all proxies, regardless of anonymity level, set this option to NULL.
     */
    anonymityLevels: ['transparent', 'anonymous', 'elite']
};

// `gettingProxies` is an event emitter object.
//var gettingProxies = ProxyLists.getProxies(options);
var gettingProxies = ProxyLists.getProxiesFromSource('bugng', options);

gettingProxies.on('data', function (proxies) {
    // Received some proxies.
    console.log('get proxies', proxies);
});

gettingProxies.on('error', function (error) {
    // Some error has occurred.
    console.error('get error', error);
});

gettingProxies.once('end', function () {
    // Done getting proxies.
    console.error('end');
});
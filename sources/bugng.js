'use strict';

var _ = require('underscore');
var async = require('async');
var cheerio = require('cheerio');
var EventEmitter = require('events').EventEmitter || require('events');
var request = require('request');

var anonymityLevels = {
    '高匿名': 'elite',
    '透明': 'transparent'
};

var limitPerPage = 15;
var maxPage = 5;

module.exports = {

    homeUrl: 'http://www.bugng.com/',

    getProxies: function (options) {

        options || (options = {});

        var emitter = new EventEmitter();
        var listUrls = this.prepareListUrls(options);
        var asyncMethod = options.series === true ? 'eachSeries' : 'each';

        var fn = async.seq(
            this.getListHtml,
            this.parseListHtml
        );

        async[asyncMethod](listUrls,

            function (listUrl, next) {
                var numProxiesFromLastPage;
                var page = 0;
                async.until(function () {
                    return page >= maxPage || numProxiesFromLastPage < limitPerPage;
                }, function (nextPage) {
                    fn(page++, listUrl, function (error, proxies) {
                        if (error) {
                            emitter.emit('error', error);
                            return nextPage(error);
                        }

                        if (options.sample) {
                            // Stop after this page.
                            numProxiesFromLastPage = 0;
                        } else {
                            // Will continue if there are more pages to get.
                            numProxiesFromLastPage = proxies && proxies.length || 0;
                        }
                        emitter.emit('data', proxies);
                        nextPage();
                    });
                }, function () {
                    next();
                });
            },

            function () {
                emitter.emit('end');
            });

        return emitter;
    },

    prepareListUrls: function (options) {

        var listUrls = [];

        if (_.contains(options.anonymityLevels, 'transparent')) {
            listUrls.push('http://www.bugng.com/gnpt');
        }

        if (_.contains(options.anonymityLevels, 'elite')) {
            listUrls.push('http://www.bugng.com/gngn');
        }

        if (options.sample) {
            // When sampling, use only one list URL.
            listUrls = listUrls.slice(0, 1);
        }

        return listUrls;
    },

    getListHtml: function (page, listUrl, cb) {
        console.log('page', page)
        request({
            method: 'GET',
            url: page ? listUrl + '?page=' + page : listUrl
        }, function (error, response, data) {

            if (error) {
                return cb(error);
            }

            cb(null, data);
        });
    },

    parseListHtml: function (listHtml, cb) {

        try {
            // console.log('listHtml != null', listHtml);
            var proxies = [];
            var $ = cheerio.load(listHtml);
            $('tr', '#target').each(function (index, tr) {
                var ipAddress = $('td', tr).eq(0).text().toString();
                var port = parseInt($('td', tr).eq(1).text().toString());

                var anonymityLevel = $('td', tr).eq(2).text().toString();
                if (!_.isUndefined(anonymityLevels[anonymityLevel])) {
                    anonymityLevel = anonymityLevels[anonymityLevel];
                }

                var protocol = $('td', tr).eq(3).text().toString().toLowerCase();
                var protocolArray = protocol.split(', ')
                var requestType = $('td', tr).eq(4).text().toString().toLowerCase();

                var speed = $('td', tr).eq(5).text().toString().toLowerCase();

                var checkTime = $('td', tr).eq(6).text().toString().toLowerCase();

                if(protocolArray.length > 1) {
                    protocolArray.forEach(function (protocol) {
                        proxies.push({
                            ipAddress: ipAddress,
                            port: port,
                            protocols: [protocol],
                            anonymityLevel: anonymityLevel,
                            requestType: requestType,
                            speed: speed,
                            checkTime: checkTime
                        });
                    })
                }
                else
                {
                    proxies.push({
                        ipAddress: ipAddress,
                        port: port,
                        protocols: [protocol],
                        anonymityLevel: anonymityLevel,
                        requestType: requestType,
                        speed: speed,
                        checkTime: checkTime
                    });
                }
            });

        } catch (error) {
            return cb(error);
        }

        cb(null, proxies);
    }
};

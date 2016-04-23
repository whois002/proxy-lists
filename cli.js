'use strict';

var _ = require('underscore');
var fs = require('fs');
var program = require('commander');

var pkg = JSON.parse(fs.readFileSync(__dirname + '/package.json'));
var ProxyLists = require('.');

program
	.version(pkg.version)
	.description(pkg.description);

program
	.command('get')
		.option(
			'-a, --anonymity-levels',
			'Get proxies with these anonymity levels [' + ProxyLists._anonymityLevels.join(', ') + ']',
			ProxyLists._anonymityLevels
		)
		.option(
			'-c, --countries',
			'Get proxies from these countries [us, ca, cz, ..]',
			_.keys(ProxyLists._countries)
		)
		.option(
			'-p, --protocols',
			'Get proxies that support these protocols [' + ProxyLists._protocols.join(', ') + ']',
			ProxyLists._protocols
		)
		.action(function() {

			var options = {};

			if (this.countries) {
				options.countries = this.countries;
			}

			if (this['anonymity-levels']) {
				options.anonymityLevels = this['anonymity-levels'];
			}

			if (this.protocols) {
				options.protocols = this.protocols;
			}

			var gettingProxies = ProxyLists.getProxies(options);
		});

program
	.command('list')
		.option(
			'-w, --white-list',
			'Include only these sources',
			_.keys(ProxyLists._sources)
		)
		.option(
			'-b, --black-list',
			'Exclude these sources',
			_.keys(ProxyLists._sources)
		)
		.action(function() {
			console.log('list');
		});

program.parse(process.argv);

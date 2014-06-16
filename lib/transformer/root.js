/**
 * Transforms root element: adds required attributes
 */
var utils = require('../utils');
var pkg = require('../../package.json');

var exslNS = {
	date:    'http://exslt.org/dates-and-times',
	dyn:     'http://exslt.org/dynamic',
	exsl:    'http://exslt.org/common',
	common:  'http://exslt.org/common',
	func:    'http://exslt.org/functions',
	math:    'http://exslt.org/math',
	random:  'http://exslt.org/random',
	regexp:  'http://exslt.org/regular-expressions',
	set:     'http://exslt.org/sets',
	strings: 'http://exslt.org/strings'
};

module.exports = function(node) {
	if (utils.isTemplateNode(node, 'stylesheet') && !node.parent) {
		node.name = 'xsl:stylesheet';
		node.attribs['xmlns:xsl'] = 'http://www.w3.org/1999/XSL/Transform';
		node.attribs['version'] = '1.0';

		if (node.attribs.use) {
			var prefixes = [];
			node.attribs.use.split(/\s+/).forEach(function(ns) {
				if (ns in exslNS) {
					node.attribs['xmlns:' + ns] = exslNS[ns];
					prefixes.push(ns);
				}
			});

			if (prefixes.length) {
				if ('extension-element-prefixes' in node.attribs) {
					node.attribs['extension-element-prefixes'] += ' ';
				} else {
					node.attribs['extension-element-prefixes'] = '';
				}

				node.attribs['extension-element-prefixes'] += prefixes.join(' ');
			}

			delete node.attribs.use;
		}
	}
};
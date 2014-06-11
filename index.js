var DomUtils = require('domutils');
var utils = require('./lib/utils');

var transformers = [
	require('./lib/transformer/root'),
	require('./lib/transformer/if'),
	require('./lib/transformer/attribute-element'),
	require('./lib/transformer/attribute-set-element'),
	require('./lib/transformer/param-element'),
	require('./lib/transformer/invoke-template'),
	require('./lib/transformer/attributes-expression'),
	require('./lib/transformer/xsl'),
	require('./lib/transformer/text')
];

function transform(node) {
	for (var i = 0, il = transformers.length, res; i < il; i++) {
		res = transformers[i](node);
		if (res === false) {
			// stop further transformations
			return;
		}
	}

	if (node.children) {
		node.children.forEach(transform);
	}
}

module.exports = {
	transform: function(code) {
		var dom = utils.makeDom(code);
		dom.forEach(function(node) {
			transform(node);
		});

		return DomUtils.getOuterHTML(dom[0]);
	}
};
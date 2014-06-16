var DomUtils = require('domutils');
var utils = require('./lib/utils');

var transformers = [
	require('./lib/transformer/root'),
	require('./lib/transformer/if'),
	require('./lib/transformer/for-element'),
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
		// number of children may change during transformation
		// (e.g. `node.children.length` may change)
		// so use unoptimized loop 
		for (var i = 0; i < node.children.length; i++) {
			transform(node.children[i]);
		}
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
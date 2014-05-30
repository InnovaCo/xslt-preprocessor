var DomUtils = require('domutils');
var htmlparser = require('htmlparser2');

/**
 * Transforms given markup to DOM
 * @param  {String} markup Markup to transform
 * @return {Array}         Array of DOM nodes
 */
exports.makeDom = function(markup, options) {
	options = options || {xmlMode: true};
	var handler = new htmlparser.DomHandler();
	var parser = new htmlparser.Parser(handler, options);
	parser.write(markup);
	parser.done();
	return handler.dom;
};

exports.prependFragment = function(elem, fragment) {
	if (!fragment || !fragment.length) {
		return;
	}

	var firstChild = elem.children[0];
	var lastChild = fragment[fragment.length - 1];

	if (firstChild && lastChild) {
		firstChild.prev = lastChild;
		lastChild.next = firstChild;
	}

	fragment.forEach(function(node) {
		node.parent = elem;
	});

	elem.children = fragment.concat(elem.children);
};
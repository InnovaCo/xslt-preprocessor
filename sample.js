var fs = require('fs');
var htmlparser = require('htmlparser2');
var DomHandler = require('domhandler');
var DomUtils = require('domutils');
var expression = require('expression-parser');

var transformers = [
	require('./lib/transformer/attribute')
];

function transform(node) {
	transformers.forEach(function(t) {
		t(node);
	});

	if (node.children) {
		node.children.forEach(transform);
	}
}

var handler = new DomHandler(function(err, dom) {
	console.log('Transforming XML');
	dom.forEach(function(node) {
		if (node.name === 't:style') {
			node.attribs['xmlns'] = 'http://www.w3.org/1999/xhtml';
			node.attribs['xmlns:t'] = 'http://inn.ru/template';
			node.attribs['xmlns:xsl'] = 'http://www.w3.org/1999/XSL/Transform';
		}

		transform(node);
	});

	var out = DomUtils.getOuterHTML(dom[0]);
	console.log('Done!');
	fs.writeFileSync('out.xml', out, {encoding: 'utf8'});
});

var parser = new htmlparser.Parser(handler, {xmlMode: true});
parser.write(fs.readFileSync('example.xml', {encoding: 'utf8'}));
parser.end();
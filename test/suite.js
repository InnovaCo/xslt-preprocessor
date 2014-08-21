var assert = require('assert');
var fs = require('fs');
var path = require('path');
var transform = require('../').transform;

function read(file) {
	return fs.readFileSync(path.join(__dirname, file), 'utf8');
}

function process(content) {
	return normalize(transform(content));
}

function normalize(str) {
	return str.replace(/__x_for_[\w\-]+/g, '__x_for_');
}

describe('XSLT preprocessor', function() {
	it('transform stylesheet', function() {
		var input = read('input/template1.xsl');
		var output = normalize(read('fixtures/template1.xsl'));

		assert.equal(process(input), output);
	});

	it('value-of shorthand', function() {
		var result = process('<stylesheet>{{ "test" }}</stylesheet>');
		assert(result.indexOf('<xsl:value-of select="&quot;test&quot;"/>') !== -1);
	});

	it('cdata', function() {
		var result = process('<stylesheet><![CDATA[ {{ test }} ]]></stylesheet>');
		assert(result.indexOf('<![CDATA[ {{ test }} ]]>') !== -1);
	});
});
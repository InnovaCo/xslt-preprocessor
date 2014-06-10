/**
 * Text node transformer: searches for `{...}` fragments in
 * text and replaces them with <xsl:value-of/> element
 */
var stringStream = require('string-stream');

module.exports = function(node) {
	if (node.type !== 'text') {
		return;
	}

	var stream = stringStream(node.data);
	var fragments = [], ch;
	while (!stream.eol()) {
		ch = stream.next();
		if (ch === '{' && stream.peek() === '{') {
			stream.backUp(1);
			fragments.push(stream.current());
			stream.pos += 2;
			stream.start = stream.pos;
		} else if (ch === '}' && stream.peek() === '}') {
			stream.backUp(1);
			fragments.push('<xsl:value-of select="' + stream.current() + '"/>');
			stream.pos += 2;
			stream.start = stream.pos;
		} else {
			stream.skipQuoted();
		}
	}

	fragments.push(stream.current());

	node.data = fragments.join('');
};
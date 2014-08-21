/**
 * Text node transformer: searches for `{...}` fragments in
 * text and replaces them with <xsl:value-of/> element
 */
var stringStream = require('string-stream');

module.exports = function(node) {
	if (node.type !== 'text') {
		return;
	}

	function sanitize(str) {
		return str.replace(/"/g, '&quot;')
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
			fragments.push('<xsl:value-of select="' + sanitize(stream.current().trim()) + '"/>');
			stream.pos += 2;
			stream.start = stream.pos;
		}
	}

	fragments.push(stream.current());

	node.data = fragments.join('');
};
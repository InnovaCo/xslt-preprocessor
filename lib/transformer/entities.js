module.exports = function(node) {
	if (node.type === 'directive' && node.name === '!ENTITIES') {
		node.name = '!DOCTYPE';
		node.data = node.data.replace(/^\s*\!ENTITIES/, '!DOCTYPE xsl:stylesheet SYSTEM')
	}
};
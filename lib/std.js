var fs = require('fs');
var path = require('path');
var utils = require('./utils');

var stdXslPath = path.join(__dirname, '../xsl/__x.xsl');
var stdXslDom = null;

function getStdXsl() {
	if (!stdXslDom) {
		var stdXslDom = utils.makeDom(fs.readFileSync(stdXslPath, 'utf8'));
	}

	return stdXslDom;
}

function findStylesheetNode(dom) {
	for (var i = 0, il = dom.length; i < il; i++) {
		if (utils.localName(dom[i]) === 'stylesheet') {
			return dom[i];
		}
	}
}

function getStdTemplates() {
	return findStylesheetNode(getStdXsl()).children;
}

module.exports = {
	inject: function(dom) {
		// make sure result contains <?xml?> declaration
		var hasDecl = dom.some(function(node) {
			return node.type === 'directive' && node.name === '?xml';
		});

		if (!hasDecl) {
			utils.prepend(dom[0], utils.makeDom('<?xml version="1.0" encoding="UTF-8"?>\n'));
		}

		utils.append(findStylesheetNode(dom), getStdTemplates());
		return dom;
	}
};
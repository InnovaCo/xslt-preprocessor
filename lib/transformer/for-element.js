/**
 * Замена элемента <for> –
 * заворачиваем код в рекурсивный именованные шаблон.
 */

var utils = require('../utils');
var uuid = require('uuid');
var domutils = require('domutils');

function stringifyTag(node) {
	var attrs = Object.keys(node.attribs).map(function(attrName) {
		return attrName + '="' + node.attribs[attrName].replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + node.name + (attrs ? ' ' + attrs : '') + '>';
}

function getRoot(node) {
	while (node.parent) {
		node = node.parent;
	}

	for (var i = 0, il = node.children.length; i < il; i++) {
		if (utils.localName(node.children[i]) === 'stylesheet') {
			return node.children[i];
		}
	}
}

function createTemplate(id, node) {
	var name = node.attribs['var'];
	var templateName = '__x_for' + id;
	var xsl = '<xsl:template name="' + templateName + '">\n\
		<xsl:param name="__x_to" select="number(0)"/>\n\
		<xsl:param name="' + name + '" select="number(' + node.attribs['from'] + ')"/>\n\
		<xsl:if test="$' + name + ' &lt; $__x_to">\n\
		' + domutils.getInnerHTML(node) + '\
		<xsl:call-template name="' + templateName + '">\n\
		<xsl:with-param name="__x_to" select="$__x_to" />\n\
		<xsl:with-param name="' + name + '" select="number($' + name + ' + 1)" />\n\
		</xsl:call-template>\n\
		</xsl:if>\n\
		</xsl:template>';

	utils.append(getRoot(node), utils.makeDom(xsl));
	return templateName;
}

module.exports = function(node) {
	if (!utils.isTemplateNode(node, 'for')) {
		return;
	}

	// make sure node contains valid attributes
	['var', 'to'].forEach(function(name) {
		if (!(name in node.attribs)) {
			throw new Error('Expecting "' + name + '" attribute in ' + stringifyTag(node));
		}
	});

	if (!node.attribs.from) {
		node.attribs.from = 0;
	}

	var templateName = createTemplate(uuid.v4(), node);
	var xsl = '<xsl:call-template name="' + templateName + '">\n\
	<xsl:with-param name="__x_to" select="number(' + node.attribs.to + ')" />\n\
	<xsl:with-param name="' + node.attribs['var'] + '" select="number(' + node.attribs.from + ')" />\n\
	</xsl:call-template>';

	utils.replace(node, utils.makeDom(xsl));
	return false;
};
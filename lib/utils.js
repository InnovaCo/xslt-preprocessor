var DomUtils = require('domutils');
var htmlparser = require('htmlparser2');
var pkg = require('../package.json');

var reNS = /^xmlns:/;

module.exports = {
	/**
	 * Transforms given markup to DOM
	 * @param  {String} markup Markup to transform
	 * @return {Array}         Array of DOM nodes
	 */
	makeDom: function(markup, options) {
		options = options || {xmlMode: true};
		var handler = new htmlparser.DomHandler();
		var parser = new htmlparser.Parser(handler, options);
		parser.write(markup);
		parser.done();
		return handler.dom;
	},

	/**
	 * Wraps given `node` with `wrapper` node
	 * @param  {Object} elem
	 * @param  {Object} wrapper
	 * @return {Object}
	 */
	wrap: function(node, wrapper) {
		var parent = node.parent;
		var ix = parent.children.indexOf(node);
		if (ix !== -1) {
			wrapper.children.push(node);
			wrapper.parent = node.parent;
			node.parent = wrapper;
			parent.children[ix] = wrapper;

			var prev = parent.children[ix - 1];
			if (prev) {
				prev.next = wrapper;
				wrapper.prev = prev;
			}

			var next = parent.children[ix + 1];
			if (next) {
				next.prev = wrapper;
				wrapper.next = next;
			}
		}
	},

	prepend: function(elem, data) {
		return this.insertAt(data, elem, 0);
	},
	append: function(elem, data) {
		return this.insertAt(data, elem, elem.children.length);
	},

	/**
	 * Inserts node or nodeset before given node
	 * @param  {Object} node Target node
	 * @param  {Object} data Data to insert (node or array of nodes)
	 */
	before: function(node, data) {
		var parent = node.parent;
		return this.insertAt(data, parent, parent.children.indexOf(node));
	},

	/**
	 * Inserts node or nodeset after given node
	 * @param  {Object} node Target node
	 * @param  {Object} data Data to insert (node or array of nodes)
	 */
	before: function(node, data) {
		var parent = node.parent;
		return this.insertAt(data, parent, parent.children.indexOf(node) + 1);
	},

	/**
	 * Replaces old node with given new one
	 * @param  {Object} oldNode
	 * @param  {Object} newNode
	 * @return {Object}
	 */
	replace: function(oldNode, newNode) {
		if (!oldNode.parent) {
			// old node is detached, nothing to replace
			return newNode;
		}

		this.before(oldNode, newNode);
		this.remove(oldNode);
		return newNode;
	},

	/**
	 * Removes give node from tree
	 * @param  {Object} node
	 * @return {Object}
	 */
	remove: function(node) {
		if (!node.parent) {
			return node;
		}

		var parent = node.parent;
		var ix = parent.children.indexOf(node);
		if (~ix) {
			parent.children.splice(ix, 1);
			if (node.prev) {
				node.prev.next = node.next;
			}

			if (node.next) {
				node.next.prev = node.prev;
			}
		}

		node.parent = null;
		return node;
	},

	/**
	 * Inserts given node or nodeset at specified child index of parent node
	 * @param  {Object} node Target node
	 * @param  {Object} data Data to insert (node or array of nodes)
	 */
	insertAt: function(data, parent, ix) {
		if (!Array.isArray(data)) {
			data = [data];
		} else {
			data = data.slice(0);
		}

		var cur;
		while (data.length) {
			cur = data.pop();
			parent.children.splice(ix, 0, cur);

			cur.next = parent.children[ix + 1];
			if (cur.next) {
				cur.next.prev = cur;
			}

			cur.prev = parent.children[ix - 1];
			if (cur.prev) {
				cur.prev.next = cur;
			}

			cur.parent = parent;
			node = cur;
		}
	},

	isTag: function(node) {
		return node && node.type === 'tag';
	},

	localName: function(node) {
		var name = null;
		if (typeof name === 'string') {
			name = node;
		} else if (this.isTag(node)) {
			name = node.name;
		}

		if (name) {
			var parts = name.split(':');
			name = parts[parts.length - 1];
		}

		return name;
	},

	getTemplateNS: function(node) {
		var root = node;
		while (root && root.parent) {
			root = root.parent;
		}

		if (!root) {
			return null;
		}

		if (!('__templateNs' in root)) {
			root.__templateNs = null;
			var attr = root.attribs || {};
			var keys = Object.keys(attr);
			for (var i = 0, il = keys.length, k; i < il; i++) {
				k = keys[i];
				if (reNS.test(k) && attr[k] === pkg.config['namespace']) {
					root.__templateNs = k.split(':')[1];
					break;
				}
			}
		}

		return root.__templateNs;
	},

	/**
	 * Check if given node is a part of template
	 * @param  {Object}  node Node to test
	 * @param  {String}  name... Local name of node to test
	 * @return {Boolean}
	 */
	isTemplateNode: function(node) {
		if (!this.isTag(node)) {
			return false;
		}
		
		var ns = this.getTemplateNS(node);
		var prefix = ns ? ns + ':' : '';
		for (var i = 1, il = arguments.length, name; i < il; i++) {
			name = arguments[i];
			if (node.name === prefix + name) {
				return name;
			}
		}
	}
};
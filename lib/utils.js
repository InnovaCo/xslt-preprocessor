var DomUtils = require('domutils');
var htmlparser = require('htmlparser2');

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
		return node.type === 'tag';
	}
};
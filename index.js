var path = require('path');
var fs = require('fs');
var glob = require('glob');
var chalk = require('chalk');
var DomUtils = require('domutils');
var utils = require('./lib/utils');
var std = require('./lib/std');

var transformers = [
	require('./lib/transformer/root'),
	require('./lib/transformer/entities'),
	require('./lib/transformer/if'),
	require('./lib/transformer/for-element'),
	require('./lib/transformer/attribute-element'),
	require('./lib/transformer/attribute-set-element'),
	require('./lib/transformer/param-element'),
	require('./lib/transformer/invoke-template'),
	require('./lib/transformer/attributes-expression'),
	require('./lib/transformer/xsl'),
	require('./lib/transformer/text')
];

function getCwd(options) {
	var cwd = (options && options.cwd) || process.cwd();
	return path.resolve(cwd);
}

function transform(node) {
	for (var i = 0, il = transformers.length, res; i < il; i++) {
		res = transformers[i](node);
		if (res === false) {
			// stop further transformations
			return;
		}
	}

	if (node.children) {
		// number of children may change during transformation
		// (e.g. `node.children.length` may change)
		// so use unoptimized loop 
		for (var i = 0; i < node.children.length; i++) {
			transform(node.children[i]);
		}
	}
}

function preprocessStylesheet(code) {
	var dom = utils.makeDom(code);
	dom.forEach(function(node) {
		transform(node);
	});

	std.inject(dom);
	var opt = {xmlMode: true};
	return dom.map(function(node) {
		return DomUtils.getOuterHTML(node, opt);
	}).join('');
}

/**
 * Processes given set of files
 * @param  {Array}  files   Absolute path to files to prerocess
 * @param  {Object} options Additional options
 */
function processFiles(files, options) {
	var fsOpt = {encoding: 'utf8'};
	files.forEach(function(f) {
		if (!fs.existsSync(f)) {
			return console.warn('File %s does not exists', chalk.bold.yellow(f));
		}

		fs.readFile(f, fsOpt, function(err, content) {
			if (err) {
				return console.error('Unable to open file %s: %s', chalk.red(f), err);
			}
			
			console.log('Processing %s', chalk.green(f));
			var out = preprocessStylesheet(content);
			var targetFile = f;
			if ('dest' in options) {
				var relpath = path.relative(getCwd(options), f);
				targetFile = path.resolve(path.join(options.dest, relpath));
				// make sure target file has .xsl extension
				targetFile = targetFile.replace(/\.\w+$/, '') + '.xsl';
			}

			fs.writeFile(targetFile, out, function(err) {
				if (err) {
					return console.log('Unable to write result to %s: %s', chalk.red(targetFile), err);
				}
				console.log('Writing result to %s', chalk.green(targetFile));
			})
		});
	});
}

module.exports = {
	/**
	 * Preprocesses given XSLT code
	 * @param {String} code XSLT code to preprocess
	 * @return {String}
	 */
	transform: preprocessStylesheet,

	/**
	 * Transforms all files matched by given glob patter
	 * @param  {Object} pattern Glob pattern, string or array of string
	 * @param  {Object} options Options used for globbing and saving result
	 */
	preprocess: function(pattern, options) {
		options = options || {};
		glob(pattern, options, function(err, files) {
			if (err) {
				return console.error('Unable to find files for preprocessing: ' + err);
			}

			processFiles(files, options);
		});
	}
};
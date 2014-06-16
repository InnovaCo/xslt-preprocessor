var fs = require('fs');
var transformer = require('./index');

console.log('Transforming XML');
var contents = fs.readFileSync('test.xml', {encoding: 'utf8'})
var out = transformer.transform(contents);
fs.writeFileSync('transformed.xsl', out, {encoding: 'utf8'});
console.log('Done!');
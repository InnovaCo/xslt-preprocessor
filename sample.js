var fs = require('fs');
var transformer = require('./index');

console.log('Transforming XML');
var contents = fs.readFileSync('example.xml', {encoding: 'utf8'})
var out = transformer.transform(contents);
fs.writeFileSync('out.xml', out, {encoding: 'utf8'});
console.log('Done!');
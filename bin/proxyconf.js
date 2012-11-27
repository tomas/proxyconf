#!/usr/bin/env node

function abort(msg){
  console.log(msg) || process.exit(1);
}

var proxyconf = require('./..');
var method = process.argv[2] || 'get';
var type = process.argv[3] || 'http';

proxyconf[method](type, function(err, out){
  if (err) return abort(err.message);
  if (out) console.log(out);
});

#!/usr/bin/env node

function abort(msg){
  console.log(msg) || process.exit(1);
}

var proxyconf = require('./..');
var type = process.argv[2] || 'http';
var method = process.argv[3] || 'get';

proxyconf[method](type, function(err, out){
  if (err) return abort(err.message);
  console.log(out);
});

const minify = require('@node-minify/core');
const cleanCSS = require('@node-minify/clean-css');
const gcc = require('@node-minify/google-closure-compiler');

minify({
  compressor: cleanCSS,
  input: 'src/dtp.css',
  output: 'dist/dtp.min.css',
  callback: function(err, min) {}
});

minify({
  compressor: gcc,
  input: 'src/dtp.js',
  output: 'dist/dtp.min.js',
  callback: function(err, min) {}
});
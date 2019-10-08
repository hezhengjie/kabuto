const path = require('path');
const buble = require('rollup-plugin-buble'); 
const typescript = require('rollup-plugin-typescript');
const resolve = require( 'rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolveFile = function(filePath) {
  return path.join(__dirname, '..', filePath)
}

module.exports = [
  {
    input: resolveFile('src/index.ts'),
    output: {
      file: resolveFile('dist/index.js'),
      format: 'umd',
      name:'index'
    }, 
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      commonjs({ 
        sourceMap: false,  // 非CommonJS模块将被忽略 
        ignoreGlobal: false //如果为true，则此插件不会处理“global”的使用
      }),
      typescript(),
      buble(),
      babel({
        "presets": [
          ["@babel/preset-env"]
        ]
      }),
      
    ],
  },
]
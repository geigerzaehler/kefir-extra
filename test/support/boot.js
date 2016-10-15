/* eslint-disable */
var P = require('path')

var srcPath = process.env.USE_BUILT ?
  P.resolve('.') :
  P.resolve('./src')

require('babel-register')({
  plugins: [
    ['module-resolver', {
      alias: {
        'src': srcPath,
        'support': P.resolve('./test/support'),
      },
    }],
  ],
})


const path = require('node:path')
const fs = require('node:fs')
const webpack = require('webpack')
const root = path.resolve(__dirname, '..')
const out = path.join(root, 'dist')
fs.mkdirSync(out, { recursive: true })
webpack(
  {
    context: root,
    mode: 'production',
    target: ['web', 'es2020'],
    entry: './src/main.tsx',
    devtool: false,
    output: {
      path: out,
      filename: 'assets/main.[contenthash:8].js',
      chunkFilename: 'assets/[name].[contenthash:8].js',
      publicPath: 'auto',
      clean: true,
    },
    module: {
      rules: [
        { test: /\.tsx?$/, exclude: /node_modules/, use: path.join(__dirname, 'typescript-loader.cjs') },
      ],
    },
    resolve: { extensions: ['.tsx', '.ts', '.js', '.mjs'] },
    optimization: { splitChunks: { chunks: 'async', minSize: 100000 } },
    performance: { hints: false },
  },
  (err, stats) => {
    if (err || stats.hasErrors()) {
      console.error(err || stats.toString({ all: false, errors: true }))
      process.exitCode = 1
      return
    }
    const file = stats
      .toJson({ all: false, entrypoints: true })
      .entrypoints.main.assets.find((x) => x.name.endsWith('.js')).name
    fs.cpSync(path.join(root, 'public'), out, { recursive: true })
    const html = fs
      .readFileSync(path.join(root, 'index.html'), 'utf8')
      .replace(
        /<script type="module" src="\.\/src\/main.tsx"><\/script>/,
        '<script defer src="./' + file + '"></script>',
      )
    fs.writeFileSync(path.join(out, 'index.html'), html)
    console.log(stats.toString({ all: false, assets: true, timings: true }))
  },
)

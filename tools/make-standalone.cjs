const fs = require('node:fs'),
  path = require('node:path'),
  os = require('node:os'),
  webpack = require('webpack')
const root = path.resolve(__dirname, '..'),
  temp = fs.mkdtempSync(path.join(os.tmpdir(), 'leonida-standalone-')),
  dest = path.resolve(process.argv[2] || path.join(root, 'dist', 'Welcome-to-Leonida.html'))
webpack(
  {
    context: root,
    mode: 'production',
    target: ['web', 'es2020'],
    entry: './src/main.tsx',
    devtool: false,
    output: { path: temp, filename: 'app.js', publicPath: '' },
    module: {
      rules: [
        { test: /\.tsx?$/, exclude: /node_modules/, use: path.join(__dirname, 'typescript-loader.cjs') },
      ],
    },
    resolve: { extensions: ['.tsx', '.ts', '.js', '.mjs'] },
    optimization: { splitChunks: false },
    plugins: [new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })],
    performance: { hints: false },
  },
  (err, stats) => {
    if (err || stats.hasErrors()) {
      console.error(err || stats.toString({ all: false, errors: true }))
      process.exitCode = 1
      return
    }
    const data = (file, mime) =>
      'data:' + mime + ';base64,' + fs.readFileSync(path.join(root, 'public', file)).toString('base64')
    const art = { mark: data('mark.svg', 'image/svg+xml') }
    for (const f of fs.readdirSync(path.join(root, 'public', 'art'))) {
      art[path.parse(f).name] = data('art/' + f, 'image/webp')
    }
    const css = fs.readFileSync(path.join(root, 'public/style.css'), 'utf8'),
      js = fs.readFileSync(path.join(temp, 'app.js'), 'utf8').replace(/<\/script/gi, '<\\/script')
    let html = fs
      .readFileSync(path.join(root, 'index.html'), 'utf8')
      .replace('<link rel="preload" as="image" href="./art/hero.webp">', '')
      .replace('./mark.svg', art.mark)
      .replace('<link rel="stylesheet" href="./style.css">', () => '<style>' + css + '</style>')
      .replace(
        '<script type="module" src="./src/main.tsx"></script>',
        () => '<script>window.LEONIDA_ART=' + JSON.stringify(art) + ';</script>\n<script>' + js + '</script>',
      )
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.writeFileSync(dest, html)
    console.log(dest, fs.statSync(dest).size)
  },
)

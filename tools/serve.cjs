const http = require('node:http')
const path = require('node:path')
const fs = require('node:fs')
const root = path.resolve(__dirname, '../dist')
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}
const port = Number(process.env.PORT || 4173)
http
  .createServer((req, res) => {
    let target
    try {
      const url = new URL(req.url, 'http://localhost')
      target = path.resolve(
        root,
        '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname),
      )
    } catch {
      res.writeHead(400).end()
      return
    }
    if (!target.startsWith(root + path.sep)) {
      res.writeHead(403).end()
      return
    }
    fs.readFile(target, (err, data) => {
      if (err) {
        res.writeHead(404).end()
        return
      }
      res.writeHead(200, {
        'Content-Type': mime[path.extname(target)] || 'application/octet-stream',
        'Content-Length': data.length,
      })
      if (req.method === 'HEAD') res.end()
      else res.end(data)
    })
  })
  .listen(port, '127.0.0.1', () => console.log('http://127.0.0.1:' + port))

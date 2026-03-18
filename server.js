const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { join } = require('path');
const { existsSync } = require('fs');
const { readFile } = require('fs/promises');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Serve arquivos estáticos de /public
      if (pathname.startsWith('/images/')) {
        const filePath = join(__dirname, 'public', pathname);
        
        if (existsSync(filePath)) {
          const fileBuffer = await readFile(filePath);
          
          // Determina o Content-Type
          let contentType = 'application/octet-stream';
          if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
            contentType = 'image/jpeg';
          } else if (pathname.endsWith('.png')) {
            contentType = 'image/png';
          } else if (pathname.endsWith('.webp')) {
            contentType = 'image/webp';
          } else if (pathname.endsWith('.gif')) {
            contentType = 'image/gif';
          } else if (pathname.endsWith('.svg')) {
            contentType = 'image/svg+xml';
          }
          
          res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600, must-revalidate',
          });
          res.end(fileBuffer);
          return;
        }
      }

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

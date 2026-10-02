// Servidor local ultraligero sin dependencias externas para ReclaMeli
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SAMPLES_DIR = path.join(__dirname, '..', 'data', 'samples');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Rutas especiales para muestras
  if (pathname === '/sample.csv' || pathname === '/data/samples/sample_ventas_meli.csv') {
    const samplePath = path.join(SAMPLES_DIR, 'sample_ventas_meli.csv');
    if (fs.existsSync(samplePath)) {
      res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8' });
      return fs.createReadStream(samplePath).pipe(res);
    }
  }

  const filePath = path.join(PUBLIC_DIR, pathname);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Acceso denegado');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 No Encontrado');
  }
});

server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 ReclaMeli Dropzone (Fase 1) en ejecución`);
  console.log(`👉 Abrí en tu navegador: http://localhost:${PORT}`);
  console.log('====================================================');
});

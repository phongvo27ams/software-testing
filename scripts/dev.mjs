import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, watch } from 'node:fs';
import path from 'node:path';
import { distDir, buildBook, rootDir } from './build.mjs';

const preferredPort = Number(process.env.PORT || 4173);
const watchTargets = [
  path.join(rootDir, 'book.md'),
  path.join(rootDir, 'styles.css'),
  path.join(rootDir, 'scripts', 'build.mjs'),
  path.join(rootDir, 'scripts', 'dev.mjs'),
];
const publicDir = path.join(rootDir, 'public');

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const liveReloadSnippet = `
<script>
  (() => {
    const source = new EventSource('/__live');
    source.onmessage = (event) => {
      if (event.data === 'reload') {
        window.location.reload();
      }
    };
    source.onerror = () => {
      source.close();
      setTimeout(() => window.location.reload(), 1000);
    };
  })();
</script>
`;

const clients = new Set();
let buildQueued = false;
let building = false;

function broadcastReload() {
  for (const client of clients) {
    client.write('data: reload\n\n');
  }
}

async function runBuild(reason = 'manual') {
  if (building) {
    buildQueued = true;
    return;
  }

  building = true;
  try {
    await buildBook();
    console.log(`[dev] rebuilt (${reason})`);
    broadcastReload();
  } catch (error) {
    console.error('[dev] build failed');
    console.error(error);
  } finally {
    building = false;
    if (buildQueued) {
      buildQueued = false;
      queueMicrotask(() => runBuild('queued'));
    }
  }
}

function scheduleBuild(reason) {
  if (buildQueued || building) {
    buildQueued = true;
    return;
  }

  buildQueued = true;
  setTimeout(() => {
    buildQueued = false;
    runBuild(reason);
  }, 100);
}

for (const target of watchTargets) {
  watch(target, { persistent: true }, () => {
    scheduleBuild(path.basename(target));
  });
}

if (existsSync(publicDir)) {
  watch(publicDir, { persistent: true, recursive: true }, (_eventType, filename) => {
    scheduleBuild(filename ? `public/${filename}` : 'public');
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/__live') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    });
    res.write('\n');
    clients.add(res);
    req.on('close', () => {
      clients.delete(res);
    });
    return;
  }

  const urlPath = req.url === '/' ? '/index.html' : req.url || '/index.html';
  const filePath = path.join(distDir, urlPath.replace(/^\//, ''));

  try {
    let content = await readFile(filePath);
    const extension = path.extname(filePath);
    const contentType = mimeTypes[extension] || 'application/octet-stream';

    if (extension === '.html') {
      const html = content.toString('utf8').replace('</body>', `${liveReloadSnippet}</body>`);
      content = Buffer.from(html, 'utf8');
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

await runBuild('startup');

server.on('error', (error) => {
  if (error.code !== 'EADDRINUSE') {
    throw error;
  }

  const nextPort = Number(server.address()?.port || currentPort) + 1;
  currentPort = nextPort;
  server.listen(currentPort);
});

let currentPort = preferredPort;
server.listen(currentPort, () => {
  const address = server.address();
  const actualPort = typeof address === 'object' && address ? address.port : currentPort;
  console.log(`[dev] live preview available at http://localhost:${actualPort}`);
});

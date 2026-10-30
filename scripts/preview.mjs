/**
 * 本地预览 GitHub Pages 产物：
 * 线上站点挂在 /ncee/ 下（next.config.ts 的 basePath），直接 `serve out` 会因为
 * 资源前缀对不上而 404。这个脚本把 /ncee/* 的请求映射到 out/*。
 *
 * 用法：npm run build && npm run preview → http://localhost:7788/ncee/
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../out/', import.meta.url));
const PREFIX = '/ncee';
const PORT = Number(process.env.PORT ?? 7788);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

async function resolveFile(pathname) {
  const candidates = [join(ROOT, pathname)];
  if (pathname.endsWith('/')) candidates.push(join(ROOT, pathname, 'index.html'));
  else candidates.push(join(ROOT, `${pathname}.html`), join(ROOT, pathname, 'index.html'));

  for (const file of candidates) {
    try {
      const info = await stat(file);
      if (info.isFile()) return file;
    } catch {
      /* 继续尝试下一个候选路径 */
    }
  }
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === '/' || pathname === PREFIX) {
    res.writeHead(302, { location: `${PREFIX}/${url.search}` });
    res.end();
    return;
  }
  if (!pathname.startsWith(`${PREFIX}/`)) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end(`线上站点只活在 ${PREFIX}/ 下，请访问 http://localhost:${PORT}${PREFIX}/`);
    return;
  }

  pathname = pathname.slice(PREFIX.length);
  const file = await resolveFile(pathname);

  if (!file) {
    const fallback = join(ROOT, '404.html');
    res.writeHead(404, { 'content-type': MIME['.html'] });
    res.end(await readFile(fallback).catch(() => '404'));
    return;
  }

  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(await readFile(file));
}).listen(PORT, () => {
  console.log(`preview: http://localhost:${PORT}/ → ${PREFIX}/`);
});

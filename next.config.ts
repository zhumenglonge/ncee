import type { NextConfig } from 'next';
import { BASE_PATH } from './lib/basePath';

/**
 * 站点固定部署在 https://<user>.github.io/ncee/，
 * 所以 basePath / assetPrefix 写死为 /ncee，dev 与生产路径一致，避免上线后静态资源 404。
 */
const basePath = BASE_PATH;

const nextConfig: NextConfig = {
  // 纯静态导出：next build 产出 out/，由 GitHub Actions 直接发布
  output: 'export',
  basePath,
  assetPrefix: basePath,
  // GitHub Pages 只会把 /schools/cs-01/ 映射到 /schools/cs-01/index.html
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;

/**
 * 站点固定部署在 https://<user>.github.io/ncee/。
 * next.config.ts 的 basePath / assetPrefix 与页面里手写 src 的静态资源（如 public/textbooks 封面图）
 * 共用这一个常量：原生 <img> 不会自动加 basePath，漏了前缀线上会 404。
 */
export const BASE_PATH = '/ncee';

/** 给 public 下的静态资源路径补 basePath 前缀 */
export const asset = (path: string) => `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;

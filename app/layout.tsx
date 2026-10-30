import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@/app/globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SITE } from '@/data/site';

export const metadata: Metadata = {
  metadataBase: new URL('https://zhumenglonge.github.io'),
  title: {
    default: `${SITE.name} · ${SITE.subtitle}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ['湖南单招', '2027 单招', '高职单招', '湖南高职院校', '职业适应性测试', '单招题库'],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: SITE.name,
    title: `${SITE.name} · ${SITE.subtitle}`,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF8F4' },
    { media: '(prefers-color-scheme: dark)', color: '#15140F' },
  ],
};

/**
 * 主题必须在首次绘制前落到 <html> 上，否则暗色用户会先看到一帧白屏。
 * 这段脚本同步执行于 body 开头，比任何 React 代码都早。
 */
const themeScript = `(function(){try{var v=JSON.parse(localStorage.getItem('hndz27:theme')||'"light"');document.documentElement.dataset.theme=v==='dark'?'dark':'light';}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" data-theme="light" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <SiteHeader />
        <main className="mx-auto max-w-[1180px] px-5 pt-[26px] pb-[90px] max-[640px]:px-3.5 max-[640px]:pt-[18px]">
          {children}
        </main>
      </body>
    </html>
  );
}

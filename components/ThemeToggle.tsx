'use client';

import { useEffect, useState } from 'react';

const THEME_KEY = 'hndz27:theme';
type Theme = 'light' | 'dark';

/**
 * 主题真值存在 <html data-theme> 上（由 layout 的内联脚本先行设置），
 * 组件只负责读取和切换，localStorage 格式与旧版保持 JSON 字符串以兼容老用户的偏好。
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  function toggle() {
    const next: Theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(next));
    } catch {
      /* 忽略隐私模式写入失败 */
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title="切换深浅色"
      aria-label="切换深浅色"
      className="grid size-[34px] shrink-0 place-items-center rounded-[10px] border border-line bg-card text-[15px] hover:border-ink3"
    >
      {theme === 'dark' ? '☀' : '◐'}
    </button>
  );
}

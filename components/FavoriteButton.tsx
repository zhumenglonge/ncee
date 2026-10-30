'use client';

import { actions, useAppState } from '@/lib/store';
import { cn } from '@/lib/cn';

/** 列表卡片右上角的星标 */
export function FavoriteIcon({ id, className }: { id: string; className?: string }) {
  const { fav } = useAppState();
  const on = fav.includes(id);

  return (
    <button
      type="button"
      onClick={() => actions.toggleFav(id)}
      title={on ? '取消收藏' : '收藏'}
      aria-label={on ? '取消收藏' : '收藏'}
      aria-pressed={on}
      className={cn(
        'rounded-md px-1 py-0.5 text-[15px] leading-none transition',
        on ? 'text-gold' : 'text-ink3 hover:text-ink2',
        className,
      )}
    >
      {on ? '★' : '☆'}
    </button>
  );
}

/** 详情页底部的收藏按钮 */
export function FavoriteButton({ id }: { id: string }) {
  const { fav } = useAppState();
  const on = fav.includes(id);

  return (
    <button
      type="button"
      onClick={() => actions.toggleFav(id)}
      aria-pressed={on}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[11px] border px-4 py-2.5 text-[13.5px] font-semibold transition hover:-translate-y-px',
        on
          ? 'border-gold bg-gold-soft text-gold'
          : 'border-red bg-red text-on-red shadow-[0_8px_20px_-12px_var(--red)] hover:brightness-[1.06]',
      )}
    >
      {on ? '★ 已收藏' : '☆ 收藏这所院校'}
    </button>
  );
}

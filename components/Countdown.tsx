'use client';

import { useEffect, useState } from 'react';
import { EXAM_DATE } from '@/data/site';

interface Left {
  d: number;
  h: string;
  m: string;
  s: string;
}

/**
 * 倒计时在客户端才算，服务端渲染时刻的时间差没有意义，
 * 首帧统一渲染 "—"，避免水合不一致。
 */
export function useCountdown(target: Date = EXAM_DATE): Left | null {
  const [left, setLeft] = useState<Left | null>(null);

  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setLeft({
        d: Math.floor(diff / 86_400_000),
        h: pad(Math.floor((diff % 86_400_000) / 3_600_000)),
        m: pad(Math.floor((diff % 3_600_000) / 60_000)),
        s: pad(Math.floor((diff % 60_000) / 1000)),
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return left;
}

/** 顶栏的小胶囊：距考试 N 天 */
export function CountdownPill() {
  const left = useCountdown();
  return (
    <div className="rounded-full border border-line bg-card px-3 py-1.5 text-xs whitespace-nowrap text-ink2 max-[640px]:hidden">
      距考试 <b className="text-red tabular-nums">{left ? left.d : '—'}</b> 天
    </div>
  );
}

/** 概览页的四格倒计时 */
export function CountdownGrid() {
  const left = useCountdown();
  const cells = [
    { v: left ? String(left.d) : '--', u: '天' },
    { v: left?.h ?? '--', u: '时' },
    { v: left?.m ?? '--', u: '分' },
    { v: left?.s ?? '--', u: '秒' },
  ];

  return (
    <div className="mt-5 flex flex-wrap gap-2.5 max-[480px]:grid max-[480px]:grid-cols-4 max-[480px]:gap-2">
      {cells.map((c) => (
        <div
          key={c.u}
          className="relative z-[1] min-w-[74px] rounded-xl border border-line2 bg-card2 px-3 py-2.5 text-center max-[480px]:min-w-0 max-[480px]:px-1 max-[480px]:py-[7px]"
        >
          <b className="block text-2xl tracking-[-0.5px] tabular-nums max-[480px]:text-lg">{c.v}</b>
          <span className="text-[11px] text-ink3">{c.u}</span>
        </div>
      ))}
    </div>
  );
}

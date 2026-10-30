'use client';

import { useEffect, useRef, useState } from 'react';
import { EXAM_DATE } from '@/data/site';
import { cn } from '@/lib/cn';
import { ExamCalendar } from '@/components/ExamCalendar';

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

/** 顶栏的小胶囊：距考试 N 天，点开看考试日历 */
export function CountdownPill() {
  const left = useCountdown();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  /* 点胶囊外面或按 Esc 时收起日历 */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={boxRef} className="relative max-[640px]:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title="点开看考试日历"
        className={cn(
          'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition duration-150',
          open
            ? 'border-red/50 bg-red-soft text-red'
            : 'border-line bg-card text-ink2 hover:border-ink3 hover:text-ink',
        )}
      >
        距考试 <b className="tabular-nums">{left ? left.d : '—'}</b> 天
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden
        >
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="考试日历"
          className="absolute right-0 top-[calc(100%+8px)] z-50 animate-pop"
        >
          <ExamCalendar />
        </div>
      )}
    </div>
  );
}

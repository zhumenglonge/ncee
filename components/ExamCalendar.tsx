'use client';

import { useMemo, useState } from 'react';
import { EXAM_DATE, VOLUNTEER_ROUNDS } from '@/data/site';
import { cn } from '@/lib/cn';

/* ------------------------------------------------------------- 考试日标记 */

type Mark = { round: 'first' | 'second'; firstDay: boolean };

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/** 把两个志愿的考试区间摊平成「日期 -> 标记」，日历格子按 key 取样式 */
const MARKS: Map<string, Mark> = (() => {
  const map = new Map<string, Mark>();
  for (const r of VOLUNTEER_ROUNDS) {
    // 归一到正午再逐日 +1，避开时区与跨日的边界抖动
    const cur = new Date(r.start);
    const end = new Date(r.end);
    cur.setHours(12, 0, 0, 0);
    end.setHours(12, 0, 0, 0);
    let first = true;
    while (cur.getTime() <= end.getTime()) {
      map.set(dayKey(cur), { round: r.key, firstDay: first });
      first = false;
      cur.setDate(cur.getDate() + 1);
    }
  }
  return map;
})();

const WEEK = ['一', '二', '三', '四', '五', '六', '日'];

/** 一个月的格子：前导空位 + 每一天 + 末尾补空，凑成整周 */
function buildCells(y: number, m: number): (Date | null)[] {
  const lead = (new Date(y, m, 1).getDay() + 6) % 7; // 周一作第一列
  const days = new Date(y, m + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= days; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7) cells.push(null);
  return cells;
}

/**
 * 考试日历：点顶栏「距考试 N 天」弹出，默认翻到第一志愿开考那个月，
 * 开考日用红色着重标出，第二志愿考试日用金色标出。
 */
export function ExamCalendar() {
  const examYm = useMemo(() => ({ y: EXAM_DATE.getFullYear(), m: EXAM_DATE.getMonth() }), []);
  const [ym, setYm] = useState(examYm);
  const cells = useMemo(() => buildCells(ym.y, ym.m), [ym]);
  const today = dayKey(new Date());
  const inExamMonth = ym.y === examYm.y && ym.m === examYm.m;

  const shift = (delta: number) =>
    setYm(({ y, m }) => {
      const d = new Date(y, m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  return (
    <div className="w-[318px] rounded-card border border-line bg-card p-4 shadow-card">
      <div className="flex items-baseline justify-between">
        <b className="text-[13.5px]">考试日历</b>
        {!inExamMonth && (
          <button
            type="button"
            onClick={() => setYm(examYm)}
            className="text-[11px] font-semibold text-red transition hover:underline"
          >
            回考试月
          </button>
        )}
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          aria-label="上一个月"
          className="grid size-7 place-items-center rounded-full text-[15px] text-ink3 transition hover:bg-card2 hover:text-ink"
        >
          ‹
        </button>
        <b className="text-[14px] tabular-nums">
          {ym.y} 年 {ym.m + 1} 月
        </b>
        <button
          type="button"
          onClick={() => shift(1)}
          aria-label="下一个月"
          className="grid size-7 place-items-center rounded-full text-[15px] text-ink3 transition hover:bg-card2 hover:text-ink"
        >
          ›
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 text-center text-[10.5px] text-ink3">
        {WEEK.map((w) => (
          <span key={w} className="py-1">
            周{w}
          </span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <span key={`blank${i}`} />;
          const key = dayKey(d);
          const mark = MARKS.get(key);
          const isToday = key === today;
          return (
            <div
              key={key}
              className={cn(
                'flex h-[38px] flex-col items-center justify-center rounded-[9px] text-[12.5px] leading-none tabular-nums',
                !mark && isToday && 'font-semibold text-ink ring-1 ring-ink/45',
                mark?.round === 'first' &&
                  (mark.firstDay
                    ? 'bg-red font-bold text-on-red shadow-[0_8px_16px_-10px_var(--red)]'
                    : 'bg-red-soft font-semibold text-red'),
                mark?.round === 'second' && 'bg-gold-soft font-semibold text-gold',
                !mark && !isToday && 'text-ink2',
              )}
            >
              <span>{d.getDate()}</span>
              {mark && (
                <span
                  className={cn(
                    'mt-[3px] text-[9px] leading-none',
                    mark.round === 'first'
                      ? mark.firstDay
                        ? 'text-on-red/80'
                        : 'text-red/75'
                      : 'text-gold/75',
                  )}
                >
                  {mark.round === 'first' ? '一志愿' : '二志愿'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 space-y-[5px] border-t border-line2 pt-[10px] text-[11px] text-ink3">
        <p className="flex items-center gap-1.5">
          <span className="inline-block size-[10px] shrink-0 rounded-[3px] bg-red" />
          第一志愿考试 3.13 — 3.14，首日 09:00 开考
        </p>
        <p className="flex items-center gap-1.5">
          <span className="inline-block size-[10px] shrink-0 rounded-[3px] bg-gold" />
          第二志愿考试 4.10 — 4.11，一志愿没录上才考
        </p>
        <p className="flex items-center gap-1.5">
          <span className="inline-block size-[10px] shrink-0 rounded-[3px] ring-1 ring-ink/45" />
          今天 · 具体时段以准考证为准
        </p>
      </div>
    </div>
  );
}

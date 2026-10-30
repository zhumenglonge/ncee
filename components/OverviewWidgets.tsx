'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { QUESTIONS } from '@/data/questions';
import { TASK_TPL } from '@/data/site';
import { actions, todayKey, useAppState, useTodayTasks } from '@/lib/store';
import { cn } from '@/lib/cn';

const TOTAL = QUESTIONS.length;

/** 题库完成度环形图 + 已答题数 */
export function ProgressCard() {
  const { done } = useAppState();
  const answered = Object.keys(done).length;
  const pct = TOTAL ? Math.round((answered / TOTAL) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-line bg-card p-[22px] shadow-card max-[900px]:flex-row max-[900px]:justify-around max-[480px]:gap-2 max-[480px]:px-3.5 max-[480px]:py-[18px]">
      <div className="ring size-[132px] max-[480px]:size-24" style={{ '--p': pct } as CSSProperties}>
        <div className="absolute inset-0 z-[1] grid place-items-center text-center">
          <div>
            <b className="block text-[26px] leading-[1.1] max-[480px]:text-xl">{pct}%</b>
            <span className="text-[11px] text-ink3">题库完成度</span>
          </div>
        </div>
      </div>
      <p className="text-center text-[12.5px] text-ink3">
        已答 <b className="text-ink">{answered}</b> / <b className="text-ink">{TOTAL}</b> 题
        <br />
        保持每天 20 题，节奏就很稳
      </p>
      <Link
        href="/drill/"
        className="rounded-[11px] border border-red bg-red px-4 py-2.5 text-[13.5px] font-semibold text-on-red shadow-[0_8px_20px_-12px_var(--red)] transition hover:-translate-y-px hover:brightness-[1.06]"
      >
        继续刷题
      </Link>
    </div>
  );
}

/** 四个统计格 */
export function StatsRow() {
  const { done, stats, fav } = useAppState();
  const rate = stats.answered ? `${Math.round((stats.correct / stats.answered) * 100)}%` : '—';

  const items = [
    { label: '题库总量', value: TOTAL, unit: '题' },
    { label: '已作答', value: Object.keys(done).length, unit: '题' },
    { label: '正确率', value: rate, unit: '' },
    { label: '收藏院校', value: fav.length, unit: '所' },
  ];

  return (
    <div className="mb-4 grid grid-cols-4 gap-3.5 max-[900px]:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-card border border-line bg-card px-[18px] py-4 shadow-card">
          <span className="text-xs text-ink3">{item.label}</span>
          <b className="block text-[26px] tracking-[-0.5px] tabular-nums">
            {item.value}
            {item.unit && <small className="ml-[3px] text-xs font-medium text-ink3">{item.unit}</small>}
          </b>
        </div>
      ))}
    </div>
  );
}

/** 今日任务打卡 */
export function TodayTasks() {
  const tasks = useTodayTasks(TASK_TPL.length);
  const day = todayKey();

  return (
    <div className="rounded-card border border-line bg-card p-5 shadow-card">
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-[15px]">今日任务</h3>
        <span className="text-xs text-ink3">
          {tasks.filter(Boolean).length} / {TASK_TPL.length} 完成
        </span>
      </div>
      {TASK_TPL.map((task, i) => (
        <button
          type="button"
          key={task.t}
          onClick={() => actions.toggleTask(day, i, TASK_TPL.length)}
          className="flex w-full items-start gap-[11px] border-t border-dashed border-line py-[11px] text-left first-of-type:border-t-0"
        >
          <span
            className={cn(
              'mt-[3px] grid size-[19px] shrink-0 place-items-center rounded-md border-[1.5px] text-[11px] transition duration-[180ms]',
              tasks[i] ? 'border-jade bg-jade text-white' : 'border-line text-transparent',
            )}
          >
            ✓
          </span>
          <span className="block">
            <b className={cn('block text-sm font-semibold', tasks[i] && 'text-ink3 line-through')}>{task.t}</b>
            <span className="block text-xs text-ink3">{task.s}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

/** 概览右侧的推荐院校（跳转到详情页，代替旧版的弹窗） */
export function FeaturedSchools({ schools }: { schools: Array<{ id: string; name: string; city: string; nature: string; tags: string[] }> }) {
  return (
    <div className="rounded-card border border-line bg-card p-5 shadow-card">
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-[15px]">值得一看的院校</h3>
        <Link href="/schools/" className="rounded-[9px] border border-line bg-card px-3 py-1.5 text-[12.5px] font-semibold transition hover:border-ink3">
          全部
        </Link>
      </div>
      {schools.map((s) => (
        <Link key={s.id} href={`/schools/${s.id}/`} className="flex w-full items-center gap-[11px] rounded-xl p-2.5 text-left transition hover:bg-card2">
          <span className="grid size-[38px] shrink-0 place-items-center rounded-[11px] bg-jade-soft text-sm font-extrabold text-jade">
            {s.name.slice(2, 3)}
          </span>
          <span className="min-w-0">
            <b className="block max-w-[19ch] truncate text-[13.5px]">{s.name}</b>
            <span className="text-[11.5px] text-ink3">
              {s.city} · {s.nature} · {s.tags[0]}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}

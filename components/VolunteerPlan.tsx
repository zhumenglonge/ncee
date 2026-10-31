'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { SCHOOLS, getSchool } from '@/data/schools';
import { VOLUNTEER_ROUNDS } from '@/data/site';
import type { School, VolunteerRound } from '@/lib/types';
import { actions, useAppState, type VolunteerSlots } from '@/lib/store';
import { cn } from '@/lib/cn';

type Slot = keyof VolunteerSlots;

/** 距开考还有多少天：和服务端渲染保持一致，首帧显示「—」 */
function useDaysLeft(start: Date): number | null {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setDays(Math.max(0, Math.ceil((start.getTime() - Date.now()) / 86_400_000)));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [start]);

  return days;
}

function SchoolPicker({
  takenId,
  onPick,
  onClose,
}: {
  takenId: string | null;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const [keyword, setKeyword] = useState('');

  const list = useMemo(() => {
    const kw = keyword.trim();
    if (!kw) return SCHOOLS;
    return SCHOOLS.filter((s) => (s.name + s.city + s.hot.join('') + s.tags.join('')).includes(kw));
  }, [keyword]);

  return (
    <div className="mt-1.5 animate-pop rounded-[10px] border border-line bg-card p-2">
      <div className="flex items-center gap-1.5">
        <label className="flex flex-1 items-center gap-1.5 rounded-[8px] border border-line bg-card2 px-2.5 py-[5px]">
          <span className="text-[11px] text-ink3">🔍</span>
          <input
            autoFocus
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜院校 / 城市 / 专业，如「铁道」「护理」"
            className="w-full border-0 bg-transparent text-[12.5px] outline-none placeholder:text-ink3"
          />
        </label>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-[8px] border border-line bg-card2 px-2 py-1 text-[11.5px] text-ink3 transition hover:border-ink3"
        >
          收起
        </button>
      </div>

      <div className="mt-1.5 max-h-[168px] overflow-y-auto pr-1">
        {list.length ? (
          list.map((s) => {
            const taken = takenId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                disabled={taken}
                onClick={() => onPick(s.id)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-[7px] px-2 py-[5px] text-left transition',
                  taken ? 'cursor-not-allowed opacity-45' : 'hover:bg-card2',
                )}
              >
                <b className="min-w-0 truncate text-[12.5px] font-semibold">{s.name}</b>
                <span className="ml-auto shrink-0 text-[10.5px] text-ink3">
                  {taken ? '另一志愿已选' : `${s.city} · ${s.nature}`}
                </span>
              </button>
            );
          })
        ) : (
          <p className="px-2 py-2.5 text-center text-[11.5px] text-ink3">没有匹配的院校，换个关键词试试</p>
        )}
      </div>
    </div>
  );
}

function RoundRow({
  round,
  school,
  takenId,
  picking,
  tip,
  onToggle,
  onPick,
  onClear,
}: {
  round: VolunteerRound;
  school: School | undefined;
  takenId: string | null;
  picking: boolean;
  tip?: string;
  onToggle: () => void;
  onPick: (id: string) => void;
  onClear: () => void;
}) {
  const days = useDaysLeft(round.start);

  return (
    <div className="rounded-xl border border-line2 bg-card2 px-3 py-2">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="grid size-[19px] shrink-0 place-items-center rounded-full bg-red text-[11px] font-bold text-on-red">
          {round.mark}
        </span>
        <b className="text-[13px]">{round.slot}</b>
        <span className="rounded-md border border-line bg-card px-1.5 text-[11px] font-semibold tabular-nums text-red">
          {round.date}
        </span>
        <span className="text-[11.5px] text-ink3">
          还有 <b className="tabular-nums text-ink2">{days ?? '—'}</b> 天
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        {school ? (
          <>
            <span className="grid size-[24px] shrink-0 place-items-center rounded-[7px] bg-jade-soft text-[10.5px] font-extrabold text-jade">
              {school.name.slice(2, 3)}
            </span>
            <Link
              href={`/schools/${school.id}/`}
              className="min-w-0 flex-1 truncate text-[12.5px] font-semibold hover:underline"
            >
              {school.name}
            </Link>
            <span className="shrink-0 text-[11px] text-ink3 max-[560px]:hidden">
              {school.city} · {school.nature}
            </span>
            <button
              type="button"
              onClick={onToggle}
              className="shrink-0 rounded-[7px] border border-line bg-card px-2 py-0.5 text-[11.5px] font-semibold transition hover:border-ink3"
            >
              {picking ? '收起' : '更换'}
            </button>
            <button
              type="button"
              onClick={onClear}
              aria-label={`清空${round.slot}`}
              className="shrink-0 px-1 text-[11.5px] text-ink3 transition hover:text-red"
            >
              ✕
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              'w-full rounded-[9px] border border-dashed bg-card py-[5px] text-[12.5px] transition',
              picking ? 'border-red text-red' : 'border-line text-ink3 hover:border-red hover:text-red',
            )}
          >
            {picking ? '在下方列表里选一所' : '+ 选择院校'}
          </button>
        )}
      </div>

      {picking && <SchoolPicker takenId={takenId} onPick={onPick} onClose={onToggle} />}

      {tip && (
        <p className="mt-1.5 rounded-md bg-red-soft px-2 py-1 text-[11.5px] font-semibold text-red">{tip}</p>
      )}
    </div>
  );
}

/** 首页首屏的「我的两个志愿」：自己挑两所目标院校，并标明各自的预计考试时间 */
export function VolunteerPlan() {
  const { plan } = useAppState();
  const [picking, setPicking] = useState<Slot | null>(null);
  const filled = Number(Boolean(plan.first)) + Number(Boolean(plan.second));

  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-[11.5px] font-bold tracking-[1.5px] text-red">我的两个志愿</h2>
        <span className="text-[11px] text-ink3">已定 {filled} / 2</span>
      </div>

      <div className="grid gap-2">
        {VOLUNTEER_ROUNDS.map((round) => (
          <RoundRow
            key={round.key}
            round={round}
            school={plan[round.key] ? getSchool(plan[round.key]!) : undefined}
            takenId={plan[round.key === 'first' ? 'second' : 'first']}
            picking={picking === round.key}
            tip={
              round.key === 'second'
                ? '二志愿考试需同时满足：① 一志愿未录取；② 该校一志愿未招满。长沙热门院校基本在一志愿就招满，填它做二志愿等于没填——保底优先选历年一志愿未招满的院校。'
                : undefined
            }
            onToggle={() => setPicking((cur) => (cur === round.key ? null : round.key))}
            onPick={(id) => {
              actions.setPlan(round.key, id);
              setPicking(null);
            }}
            onClear={() => {
              actions.setPlan(round.key, null);
              setPicking(null);
            }}
          />
        ))}
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { getQuestion } from '@/data/questions';
import { actions, useAppState } from '@/lib/store';
import { Button, Card, Empty, Pill } from '@/components/ui';

const letter = (i: number) => 'ABCD'[i] ?? String(i + 1);

export function WrongBook() {
  const { wrong } = useAppState();
  const list = wrong.map(getQuestion).filter((q) => q !== undefined);

  return (
    <>
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-[13px] text-ink3">共 {list.length} 题</span>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/drill/?mode=wrong"
            className="inline-flex items-center rounded-[11px] border border-red bg-red px-4 py-2.5 text-[13.5px] font-semibold text-on-red shadow-[0_8px_20px_-12px_var(--red)] transition hover:-translate-y-px hover:brightness-[1.06]"
          >
            重做错题
          </Link>
          <Button
            onClick={() => {
              if (list.length && confirm('确定清空错题本吗？')) actions.clearWrong();
            }}
          >
            清空
          </Button>
        </div>
      </div>

      {list.length ? (
        <div className="grid gap-3.5">
          {list.map((q) => (
            <Card key={q.id} className="grid gap-2 px-[18px] py-4">
              <div className="flex items-center gap-2 text-xs text-ink3">
                <Pill tone="red">{q.sub}</Pill>
              </div>
              <div className="text-[14.5px] font-semibold">{q.q}</div>
              <div className="text-[12.5px] text-ink3">
                正确答案：
                <b className="font-semibold text-jade">
                  {letter(q.a)}. {q.opts[q.a]}
                </b>
              </div>
              <div className="text-[12.5px] text-ink3">{q.exp}</div>
              <div>
                <Button size="sm" onClick={() => actions.removeWrong(q.id)}>
                  移出错题本
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Empty>还没有错题。去刷几题吧，错了会自动收进来。</Empty>
      )}
    </>
  );
}

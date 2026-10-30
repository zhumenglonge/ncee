'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { QUESTIONS, SUBJECTS, getQuestion, questionsOf } from '@/data/questions';
import type { Question, Subject } from '@/lib/types';
import { actions, useAppState } from '@/lib/store';
import { Button, Card, Chip, Pill } from '@/components/ui';
import { cn } from '@/lib/cn';

type Kind = 'practice' | 'mock' | 'wrong';
type Pick = { pick: number; ok: boolean } | null;

interface Session {
  kind: Kind;
  ids: string[];
  idx: number;
  picks: Pick[];
}

const KIND_LABEL: Record<Kind, string> = {
  practice: '顺序练习',
  mock: '随机模拟',
  wrong: '错题重做',
};

const letter = (i: number) => 'ABCD'[i] ?? String(i + 1);

function shuffle<T>(input: T[]): T[] {
  const list = input.slice();
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export function DrillPanel() {
  const searchParams = useSearchParams();
  const { wrong } = useAppState();
  const [subject, setSubject] = useState<'全部' | Subject>('全部');
  const [session, setSession] = useState<Session | null>(null);
  const [notice, setNotice] = useState('');
  const startedFromUrl = useRef(false);

  const pool = useMemo(() => questionsOf(subject), [subject]);

  const start = useCallback(
    (kind: Kind) => {
      let ids: string[];
      if (kind === 'mock') {
        ids = shuffle(pool.map((q) => q.id)).slice(0, 10);
      } else if (kind === 'wrong') {
        ids = wrong.filter((id) => {
          const q = getQuestion(id);
          return q && (subject === '全部' || q.sub === subject);
        });
      } else {
        ids = pool.map((q) => q.id);
      }

      if (!ids.length) {
        setSession(null);
        setNotice(kind === 'wrong' ? '错题本里还没有题目，先去练几道吧。' : '这个科目暂时没有题目。');
        return;
      }
      setNotice('');
      setSession({ kind, ids, idx: 0, picks: Array<Pick>(ids.length).fill(null) });
    },
    [pool, subject, wrong],
  );

  // 从错题本 / 首页跳过来时带上 ?mode=wrong 等参数，自动开局
  useEffect(() => {
    if (startedFromUrl.current) return;
    const mode = searchParams.get('mode');
    if (mode !== 'practice' && mode !== 'mock' && mode !== 'wrong') return;
    // 错题列表要等 store 水合完成，否则会开出空卷
    if (mode === 'wrong' && wrong.length === 0) return;
    startedFromUrl.current = true;
    start(mode);
  }, [searchParams, start, wrong.length]);

  // 注意：副作用不能写进 setSession 的 updater 里，StrictMode 下 updater 会被调用两次
  const answer = useCallback(
    (index: number) => {
      if (!session) return;
      if (session.picks[session.idx]) return;
      const question = getQuestion(session.ids[session.idx]);
      if (!question) return;

      const ok = index === question.a;
      const picks = session.picks.slice();
      picks[session.idx] = { pick: index, ok };
      setSession({ ...session, picks });
      actions.recordAnswer(question.id, ok, session.kind);
    },
    [session],
  );

  const next = useCallback(() => {
    setSession((current) => (current ? { ...current, idx: current.idx + 1 } : current));
  }, []);

  // 键盘答题：A–D / 1–4 选项，回车或空格进入下一题
  useEffect(() => {
    if (!session) return;

    function onKeyDown(event: KeyboardEvent) {
      if (!session) return;
      const answered = session.picks[session.idx] != null;
      const key = event.key.toUpperCase();
      const byLetter = 'ABCD'.indexOf(key);
      const byNumber = Number(event.key) - 1;

      if (!answered) {
        if (byLetter >= 0 && byLetter < 4) {
          answer(byLetter);
          return;
        }
        if (byNumber >= 0 && byNumber < 4) {
          answer(byNumber);
        }
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        next();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [session, answer, next]);

  const current = session && session.idx < session.ids.length ? getQuestion(session.ids[session.idx]) : null;

  return (
    <>
      <Card className="mb-3.5 grid gap-[11px] px-[18px] py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-[34px] shrink-0 text-xs text-ink3">科目</span>
          {SUBJECTS.map((item) => {
            const count = item === '全部' ? QUESTIONS.length : QUESTIONS.filter((q) => q.sub === item).length;
            return (
              <Chip
                key={item}
                active={subject === item}
                onClick={() => {
                  setSubject(item);
                  setNotice('');
                }}
              >
                {item} <span className="opacity-60">{count}</span>
              </Chip>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="ink" onClick={() => start('practice')}>
            顺序练习
          </Button>
          <Button size="sm" onClick={() => start('mock')}>
            随机 10 题模拟
          </Button>
          <Button size="sm" onClick={() => start('wrong')}>
            错题重做
          </Button>
          {session && (
            <Button size="sm" className="ml-auto" onClick={() => setSession(null)}>
              退出本轮
            </Button>
          )}
        </div>
      </Card>

      {!session && (
        <Card className="px-6 py-11 text-center">
          <div className="mb-1.5 text-[34px]">📝</div>
          <h3 className="text-[17px]">
            {subject === '全部' ? '全部科目' : subject} · 共 {pool.length} 题
          </h3>
          <p className="mt-1.5 text-[13.5px] text-ink3">
            点上方「顺序练习」按题库顺序刷；「随机 10 题模拟」抽一套小卷。每题作答后立刻给解析。
          </p>
          {notice && <p className="mt-2 text-[13px] font-semibold text-red">{notice}</p>}
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <Button variant="primary" onClick={() => start('practice')}>
              开始练习
            </Button>
            <Button onClick={() => start('mock')}>随机 10 题</Button>
          </div>
        </Card>
      )}

      {session && !current && <ResultCard session={session} onRestart={start} onReset={() => setSession(null)} />}

      {session && current && (
        <QuestionCard
          question={current}
          session={session}
          inWrongBook={wrong.includes(current.id)}
          onAnswer={answer}
          onNext={next}
          onToggleWrong={() => actions.toggleWrong(current.id)}
        />
      )}
    </>
  );
}

/* --------------------------------------------------------------- 单题卡片 */

function QuestionCard({
  question,
  session,
  inWrongBook,
  onAnswer,
  onNext,
  onToggleWrong,
}: {
  question: Question;
  session: Session;
  inWrongBook: boolean;
  onAnswer: (index: number) => void;
  onNext: () => void;
  onToggleWrong: () => void;
}) {
  const answered = session.picks[session.idx];
  const pct = Math.round((session.idx / session.ids.length) * 100);

  return (
    <Card className="px-[26px] py-6 max-[640px]:px-4 max-[640px]:py-[18px]">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-ink3">
        <Pill tone="red">{question.sub}</Pill>
        <span>
          第 {session.idx + 1} / {session.ids.length} 题
        </span>
        <span>·</span>
        <span>{KIND_LABEL[session.kind]}</span>
        {answered ? (
          <span className={cn('ml-auto font-semibold', answered.ok ? 'text-jade' : 'text-red')}>
            {answered.ok ? '答对' : '答错'}
          </span>
        ) : (
          <span className="ml-auto">{inWrongBook ? '错题本中' : ''}</span>
        )}
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <i
          className="block h-full rounded-full bg-[linear-gradient(90deg,var(--red),#E88A5C)] transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-[18px] mb-[18px] text-[17px] leading-relaxed font-semibold tracking-[-0.2px]">{question.q}</div>

      <div className="grid gap-[9px]">
        {question.opts.map((option, i) => {
          const state = !answered ? 'idle' : i === question.a ? 'right' : answered.pick === i ? 'wrong' : 'idle';
          return (
            <button
              key={option}
              type="button"
              disabled={Boolean(answered)}
              onClick={() => onAnswer(i)}
              className={cn(
                'flex items-start gap-[11px] rounded-xl border px-[15px] py-3 text-left text-[14.5px] transition duration-150',
                state === 'idle' && 'border-line bg-card disabled:cursor-default',
                state === 'idle' && !answered && 'hover:translate-x-0.5 hover:border-ink3',
                state === 'right' && 'border-jade bg-jade-soft',
                state === 'wrong' && 'border-red bg-red-soft',
              )}
            >
              <span
                className={cn(
                  'grid size-[22px] shrink-0 place-items-center rounded-[7px] bg-card2 text-xs font-bold text-ink2',
                  state === 'right' && 'bg-jade text-white',
                  state === 'wrong' && 'bg-red text-white',
                )}
              >
                {letter(i)}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-4 rounded-xl border-l-[3px] border-jade bg-card2 px-4 py-3.5 text-[13.5px] animate-fade-in">
          <b className="mb-1 block text-xs tracking-[1px] text-jade">
            解析 · {answered.ok ? '答对了' : '注意这个坑'}
          </b>
          {question.exp}
        </div>
      )}

      <div className="mt-[18px] flex flex-wrap items-center justify-between gap-2.5">
        <Button size="sm" onClick={onToggleWrong}>
          {inWrongBook ? '★ 在错题本' : '☆ 收进错题本'}
        </Button>
        <div className="ml-auto flex items-center gap-2">
          {answered ? (
            <Button variant="primary" onClick={onNext}>
              {session.idx + 1 === session.ids.length ? '看成绩' : '下一题 →'}
            </Button>
          ) : (
            <span className="text-xs text-ink3">选一个答案就能看到解析</span>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ----------------------------------------------------------------- 成绩页 */

function ResultCard({
  session,
  onRestart,
  onReset,
}: {
  session: Session;
  onRestart: (kind: Kind) => void;
  onReset: () => void;
}) {
  const right = session.picks.filter((p) => p?.ok).length;
  const rate = Math.round((right / session.ids.length) * 100);
  const word =
    rate >= 90
      ? '稳，这个速度可以加量了'
      : rate >= 70
        ? '不错，把错题再过一遍'
        : rate >= 50
          ? '基础还行，错的题要回归知识点'
          : '先别急，错的题逐个看解析';

  return (
    <Card className="px-[26px] py-[34px] text-center">
      <div className={cn('text-[52px] leading-none font-extrabold tracking-[-2px]', rate >= 70 ? 'text-jade' : 'text-red')}>
        {rate}
        <small className="text-lg">%</small>
      </div>
      <h3 className="mt-2">
        本轮得分 {right} / {session.ids.length}
      </h3>
      <p className="mt-1.5 text-[13.5px] text-ink3">{word}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        <Button variant="primary" onClick={() => onRestart(session.kind === 'wrong' ? 'wrong' : 'mock')}>
          再来一轮
        </Button>
        <Link
          href="/wrong/"
          onClick={onReset}
          className="inline-flex items-center rounded-[11px] border border-line bg-card px-4 py-2.5 text-[13.5px] font-semibold transition hover:border-ink3"
        >
          看错题本
        </Link>
        <Button onClick={onReset}>回到设置</Button>
      </div>
    </Card>
  );
}

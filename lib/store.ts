import { useSyncExternalStore } from 'react';

/**
 * 全站学习进度：localStorage 持久化 + useSyncExternalStore 订阅。
 *
 * 关键点：静态导出时组件会在服务端渲染一遍，此时不能碰 localStorage。
 * 所以提供 getServerSnapshot（返回空状态），React 在水合阶段也会用它，
 * 首屏 HTML 与客户端首次渲染完全一致，水合结束后再切到真实快照，不会报 mismatch。
 */

export interface AnswerRecord {
  ok: boolean;
  at: number;
}

export interface AppState {
  /** 收藏的院校 id */
  fav: string[];
  /** 错题本里的题目 id */
  wrong: string[];
  /** 每道题首次作答结果 */
  done: Record<string, AnswerRecord>;
  /** 累计作答 / 答对次数 */
  stats: { answered: number; correct: number };
  /** 打卡：{ '2026-10-30': [true, false, false, false] } */
  tasks: Record<string, boolean[]>;
}

const PREFIX = 'hndz27:';

const EMPTY_STATE: AppState = {
  fav: [],
  wrong: [],
  done: {},
  stats: { answered: 0, correct: 0 },
  tasks: {},
};

/** 服务端快照必须是稳定引用，否则 useSyncExternalStore 会死循环 */
const getServerSnapshot = () => EMPTY_STATE;

let cache: AppState | null = null;
const listeners = new Set<() => void>();

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* 隐私模式或配额满：静默降级为内存态 */
  }
}

function getSnapshot(): AppState {
  if (!cache) {
    cache = {
      fav: read('fav', []),
      wrong: read('wrong', []),
      done: read('done', {}),
      stats: read('stats', { answered: 0, correct: 0 }),
      tasks: read('tasks', {}),
    };
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function commit(patch: Partial<AppState>, keys: Array<keyof AppState>) {
  cache = { ...getSnapshot(), ...patch };
  for (const key of keys) write(key, cache[key]);
  for (const listener of listeners) listener();
}

// 多标签页同步：另一个标签页改了进度，本页立刻跟上
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (!e.key || !e.key.startsWith(PREFIX)) return;
    cache = null;
    for (const listener of listeners) listener();
  });
}

/* ---------------------------------- 读取 ---------------------------------- */

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** 本地日期（YYYY-MM-DD）。不能用 toISOString，UTC 会把北京时间 0–8 点算成前一天 */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function useTodayTasks(total = 4): boolean[] {
  const { tasks } = useAppState();
  return tasks[todayKey()] ?? Array<boolean>(total).fill(false);
}

/* ---------------------------------- 写入 ---------------------------------- */

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export const actions = {
  toggleFav(id: string) {
    commit({ fav: toggle(getSnapshot().fav, id) }, ['fav']);
  },

  toggleWrong(id: string) {
    commit({ wrong: toggle(getSnapshot().wrong, id) }, ['wrong']);
  },

  removeWrong(id: string) {
    commit({ wrong: getSnapshot().wrong.filter((x) => x !== id) }, ['wrong']);
  },

  clearWrong() {
    commit({ wrong: [] }, ['wrong']);
  },

  /**
   * 记录一次作答：
   * - 答错 → 进错题本；错题重做答对 → 移出错题本
   * - done 只记录首次作答，用于题库完成度
   */
  recordAnswer(questionId: string, ok: boolean, kind: 'practice' | 'mock' | 'wrong') {
    const state = getSnapshot();
    const wrong = ok
      ? kind === 'wrong'
        ? state.wrong.filter((x) => x !== questionId)
        : state.wrong
      : state.wrong.includes(questionId)
        ? state.wrong
        : [...state.wrong, questionId];

    commit(
      {
        stats: { answered: state.stats.answered + 1, correct: state.stats.correct + (ok ? 1 : 0) },
        done: state.done[questionId] ? state.done : { ...state.done, [questionId]: { ok, at: Date.now() } },
        wrong,
      },
      ['stats', 'done', 'wrong'],
    );
  },

  toggleTask(day: string, index: number, total = 4) {
    const state = getSnapshot();
    const list = state.tasks[day] ?? Array<boolean>(total).fill(false);
    const next = list.map((v, i) => (i === index ? !v : v));
    commit({ tasks: { ...state.tasks, [day]: next } }, ['tasks']);
  },
};

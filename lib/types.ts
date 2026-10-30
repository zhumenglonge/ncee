export type Subject = '语文' | '数学' | '英语' | '职测';

export type SchoolNature = '公办' | '民办';

/** 院校库的梯队分组：前三个梯队为公办按报考热度分层，民办单独一组 */
export type SchoolTier = 'reach' | 'solid' | 'safe' | 'private';

export interface School {
  /** 唯一 id，同时作为 /schools/[slug] 的静态路由参数 */
  id: string;
  name: string;
  /** 梯队分组标识，院校库按它分块展示 */
  tier: SchoolTier;
  /** 学校官方网站，院校库标题与详情页入口直接跳转这里 */
  site: string;
  city: string;
  nature: SchoolNature;
  level: string;
  tags: string[];
  hot: string[];
  intro: string;
  exam: string;
  tip: string;
}

export interface Question {
  id: string;
  sub: Subject;
  q: string;
  opts: string[];
  /** 正确选项下标 */
  a: number;
  exp: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface TaskTemplate {
  t: string;
  s: string;
}

/** 一个志愿批次：第一志愿 / 第二志愿 */
export interface VolunteerRound {
  key: 'first' | 'second';
  /** 显示用的志愿名 */
  slot: string;
  /** 序号 ①② 里的字符 */
  mark: string;
  /** 预计考试日期区间（显示用） */
  date: string;
  /** 首场开考时间，用于算剩余天数 */
  start: Date;
  /** 考试区间最后一天，和 start 一起在考试日历上标出 */
  end: Date;
  note: string;
}

/** 首页「报名与考试流程」表的一行 */
export interface ExamFlowRow {
  /** 2027 届预估时间 */
  when: string;
  /** 往年实际日期，作为参照 */
  ref: string;
  /** 这个阶段要做什么 */
  what: string;
  /** 额外强调的条件 */
  cond?: string;
}

/** 首屏励志句；文言/古诗文带出处 */
export interface Motto {
  text: string;
  source?: string;
}

/** 单招的三种结局：一志愿录上 / 二志愿可以考 / 二志愿作废 */
export interface ExamOutcome {
  mark: string;
  tone: 'jade' | 'gold' | 'red';
  title: string;
  desc: string;
}

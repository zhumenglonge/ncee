export type Subject = '语文' | '数学' | '英语' | '职测';

export type SchoolNature = '公办' | '民办';

export interface School {
  /** 唯一 id，同时作为 /schools/[slug] 的静态路由参数 */
  id: string;
  name: string;
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

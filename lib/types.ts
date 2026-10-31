export type Subject = '语文' | '数学' | '英语' | '职测';

export type SchoolNature = '公办' | '民办';

/** 院校库的梯队分组：前三个梯队为公办按报考热度分层，民办单独一组 */
export type SchoolTier = 'reach' | 'solid' | 'safe' | 'private';

/** 单招录取分数线的单行数据（按专业记录，无数据的方向留空） */
export interface DsScoreLine {
  major: string;
  /** A 类（普高生）拟录取最低分 */
  aMin?: number;
  /** B 类（中职生）拟录取最低分 */
  bMin?: number;
}

/** 学校官网公示的 2026 年单招实录数据，卡片/详情页在有数据时展示 */
export interface Ds2026 {
  /** 第一志愿拟录取人数 */
  firstAdmitted?: number;
  /** 第二志愿拟录取人数 */
  secondAdmitted?: number;
  /** 一句话概况（录取原则、技能免试等） */
  note?: string;
  /** 公示可查的拟录取最低分（来自哪一轮志愿要在 text 里写明） */
  scoreLines?: DsScoreLine[];
  /** 分数表上方的说明（口径、同分排序等） */
  scoreNote?: string;
  /** 公示发布时间 */
  announced?: string;
  /** 数据来源说明 */
  source?: string;
}

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
  /** 2026 年单招总计划数（A/B/C/D/E 合计）；未查到官方数字时留空，卡片显示「以考试院公布为准」 */
  plan2026?: number;
  /** 2026 年单招录取实录（官网公示爬取），详情页展示用 */
  ds2026?: Ds2026;
  hot: string[];
  /** 「稳上岸」标记的推荐理由：面向以「先拿到全日制专科学历」为首要目标的考生（当兵只看学历+身体+政审，专业不限） */
  easyAdmit?: string;
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

/** 文化素质考试对应教材页的一张书卡 */
export interface Textbook {
  /** 所属科目 */
  subject: Subject;
  /** 封面图，相对 public 的路径 */
  img: string;
  /** 卡片主标题（书名） */
  title: string;
  /** 考试需要掌借的全部册次（如“上、下册都要”） */
  volumes: string;
  /** 封面图对应哪一册的说明（避免只看上册的误解） */
  coverNote: string;
  /** 主标题右侧的语义色标签 */
  tone: 'jade' | 'gold' | 'red';
  toneLabel: string;
  /** 版本 / 主编 */
  edition: string;
  publisher: string;
  isbn: string;
  /** 考纲覆盖范围 */
  scope: string;
  /** 备考怎么用这本书 */
  how: string;
}

/** 教材页「配套真题卷」板块的一张试卷资源卡 */
export interface RealPaper {
  /** 试卷名 */
  name: string;
  /** 适用人群（中职生 / 普高生） */
  audience: string;
  /** 适用人群的语义色 */
  tone: 'jade' | 'gold' | 'red';
  /** 与单招的关系 / 难度定位 */
  relation: string;
  /** 怎么刷 */
  how: string;
  /** 获取渠道说明 */
  source: string;
  /** 搜真题用的关键词 */
  findQuery: string;
}

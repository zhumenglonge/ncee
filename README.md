# 湘单招 2027 · 湖南高职单招备考站

一个给 **2027 年湖南省高职单招** 用的备考站点：查院校、刷题、记错题、看时间轴。

技术栈：**Next.js 16（App Router）+ TypeScript + Tailwind CSS v4**，`output: 'export'` 静态导出，零后端，学习进度全部存在浏览器 `localStorage`。

在线访问：<https://zhumenglonge.github.io/ncee/>

## 功能

| 板块 | 做了什么 |
| --- | --- |
| 概览 | 距 2027 年 3 月校考倒计时、题库完成度环形图、今日任务打卡、正确率统计 |
| 院校库 | 52 所湖南单招院校，按城市 / 办学性质筛选 + 关键词搜索，可收藏 |
| 院校详情 | 每所院校一个静态页 `/schools/[id]/`，含简介、优势专业、考试形式、报考提示，有独立 SEO 信息 |
| 刷题 | 语文 / 数学 / 英语 / 职业适应性测试共 51 题，即时判分 + 解析；支持顺序练习、随机 10 题模拟、错题重做、键盘作答 |
| 错题本 | 答错自动收录，重做答对自动移出，也可手动增删 |
| 备考指南 | 一年备考时间轴 + 单招常见问题 |

## 本地开发

```bash
npm install
npm run dev        # http://localhost:3000/ncee/
```

站点固定挂在 `/ncee/` 子路径下（`next.config.ts` 里的 `basePath`），**dev 和线上前缀一致**，本地怎么跑线上就怎么跑。

预览真实构建产物（含静态资源前缀）：

```bash
npm run build
npm run preview    # http://localhost:7788/ncee/
```

## 目录结构

```
.
├── app/
│   ├── layout.tsx              # 主题内联脚本 + 顶栏 + 全局样式
│   ├── page.tsx                # 概览
│   ├── schools/page.tsx        # 院校库（筛选交互在 client）
│   ├── schools/[slug]/page.tsx # 52 个静态详情页，generateStaticParams + generateMetadata
│   ├── drill/page.tsx          # 刷题
│   ├── wrong/page.tsx          # 错题本
│   ├── guide/page.tsx          # 备考指南
│   └── globals.css             # 设计令牌 + Tailwind theme + 少量组件样式
├── components/                 # 顶栏、倒计时、院校筛选、刷题面板、错题本、FAQ …
├── data/
│   ├── schools.ts              # 52 所院校
│   ├── questions.ts            # 51 道题
│   └── site.ts                 # 考试时间、任务模板、FAQ、时间轴、导航
├── lib/
│   ├── store.ts                # localStorage + useSyncExternalStore
│   ├── types.ts                # School / Question 等类型
│   └── cn.ts                   # className 合并
└── .github/workflows/deploy.yml
```

## 几个实现要点

- **静态导出 + GitHub Pages**：`basePath` / `assetPrefix` 均为 `/ncee`，`trailingSlash: true` 让 `/schools/cs-01/` 能命中 `index.html`，`images.unoptimized` 因为静态导出没有图片优化服务。
- **学习进度不能导致水合不一致**：`lib/store.ts` 用 `useSyncExternalStore`，并给 `getServerSnapshot` 返回空状态 —— 首屏 HTML 与客户端首次渲染完全一致，水合后再切到 localStorage 里的真实数据。
- **深浅色不闪屏**：主题由 `<html data-theme>` 驱动，`layout.tsx` 里一段同步脚本在首帧前就读出偏好。
- **倒计时只在客户端算**：服务端渲染时刻的时间差没有意义，首帧统一显示 `--`。

localStorage 键名统一带 `hndz27:` 前缀（`fav` / `wrong` / `done` / `stats` / `tasks` / `theme`），与旧版单文件站点完全兼容，老用户进度不会丢。

## 部署

向 `main` 分支推送后，GitHub Actions 自动 `npm ci` → `next build` → 发布 `out/` 到 GitHub Pages。

```bash
git add .
git commit -m "feat: 更新题库"
git push
```

首次部署需要仓库 Settings → Pages → Source 选 **GitHub Actions**（工作流里的 `configure-pages` 已带 `enablement: true`，一般会自动开启）。

## 数据说明

院校简介、优势专业、考试形式为备考整理版本，**招生专业、计划数、录取规则、体检要求请以湖南省教育考试院及各校当年官方招生简章为准**。倒计时锚定的 `2027-03-13` 为按往年“3 月中旬第二个周末考第一志愿”的节奏预估（2026 年为 3 月 14—15 日，第二志愿 4 月 11—12 日），官方公告后修改 `data/site.ts` 中的 `EXAM_DATE` 即可。

import type { Metadata } from 'next';
import { Card, Pill, ViewHead } from '@/components/ui';
import { asset } from '@/lib/basePath';
import { REAL_PAPERS, TEXTBOOK_NOTES, TEXTBOOKS } from '@/data/textbooks';

export const metadata: Metadata = {
  title: '单招教材',
  description: '湖南高职单招文化素质考试（语数英）对应的教材与配套真题：中职国规教材语数英基础模块（附封面、ISBN），加对口升学 / 学考数学真题卷的用法说明。',
  alternates: { canonical: '/textbooks/' },
};

/** ISBN 购书搜索直达（京东），避免用户买成同名辅导书 */
const buyHref = (isbn: string) => `https://search.jd.com/Search?keyword=${encodeURIComponent(isbn)}`;

/** 找真题的搜索直达（必应） */
const findHref = (q: string) => `https://www.bing.com/search?q=${encodeURIComponent(q)}`;

export default function TextbooksPage() {
  return (
    <div className="animate-fade-in">
      <ViewHead
        title="单招教材"
        desc="单招文化素质测试（语数英 300 分）多数院校按中职公共基础课程「基础模块」命题——语文、数学含上、下册，英语含 1~3 册，不是只看上册。"
      />

      <div className="grid grid-cols-3 items-stretch gap-3.5 max-[900px]:grid-cols-1">
        {TEXTBOOKS.map((b) => (
          <Card key={b.isbn} className="flex flex-col overflow-hidden p-0">
            <div className="relative bg-card2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(b.img)}
                alt={`${b.title} 封面`}
                className="h-[220px] w-full object-contain object-top"
                loading="lazy"
              />
              <span className="absolute top-2.5 left-2.5">
                <Pill tone="plain" className="bg-paper/90 font-semibold backdrop-blur-sm">
                  {b.subject}
                </Pill>
              </span>
              <span className="absolute right-2.5 bottom-2.5 rounded-md bg-ink/72 px-2 py-0.5 text-[11px] text-paper backdrop-blur-sm">
                {b.coverNote}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2.5 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[14.5px] leading-snug">{b.title}</h3>
                <Pill tone={b.tone} className="mt-0.5 shrink-0">{b.toneLabel}</Pill>
              </div>

              <p className="flex items-center gap-1.5 text-xs">
                <Pill tone={b.tone}>考试范围</Pill>
                <span className="font-semibold text-ink2">{b.volumes}</span>
              </p>

              <dl className="space-y-1 text-xs text-ink3">
                <div className="flex gap-1.5">
                  <dt className="shrink-0 font-semibold text-ink2">版本</dt>
                  <dd>{b.edition}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="shrink-0 font-semibold text-ink2">出版</dt>
                  <dd>{b.publisher}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="shrink-0 font-semibold text-ink2">ISBN</dt>
                  <dd className="font-mono">{b.isbn}</dd>
                </div>
              </dl>

              <p className="rounded-xl border border-transparent bg-jade-soft px-3 py-2.5 text-xs leading-relaxed text-ink2">
                <span className="font-semibold text-jade">考纲范围：</span>{b.scope}
              </p>
              <p className="rounded-xl border border-transparent bg-gold-soft px-3 py-2.5 text-xs leading-relaxed text-ink2">
                <span className="font-semibold text-gold">怎么用：</span>{b.how}
              </p>

              <a
                href={buyHref(b.isbn)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center rounded-[9px] border border-line bg-card px-3 py-1.5 text-[12.5px] font-semibold text-ink2 transition duration-180 hover:border-ink3 hover:-translate-y-px"
              >
                按 ISBN 找这本书 ↗
              </a>
            </div>
          </Card>
        ))}
      </div>

      <section className="mt-6">
        <h3 className="text-[17px]">配套真题卷</h3>
        <p className="mt-1 mb-3 text-[13px] text-ink3">数学刷题优先做这两套：中职生走对口升学，普高生走学考，正好是单招文化课的两条难度参考线。</p>
        <div className="grid grid-cols-2 gap-3.5 max-[900px]:grid-cols-1">
          {REAL_PAPERS.map((p) => (
            <Card key={p.name} className="flex flex-col gap-2.5 p-4">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-[14.5px] leading-snug">{p.name}</h4>
                <Pill tone={p.tone} className="mt-0.5 shrink-0">{p.audience}</Pill>
              </div>
              <p className="rounded-xl border border-transparent bg-jade-soft px-3 py-2.5 text-xs leading-relaxed text-ink2">
                <span className="font-semibold text-jade">和单招的关系：</span>{p.relation}
              </p>
              <p className="rounded-xl border border-transparent bg-gold-soft px-3 py-2.5 text-xs leading-relaxed text-ink2">
                <span className="font-semibold text-gold">怎么刷：</span>{p.how}
              </p>
              <p className="text-xs leading-relaxed text-ink3">
                <span className="font-semibold text-ink2">获取渠道：</span>{p.source}
              </p>
              <a
                href={findHref(p.findQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center rounded-[9px] border border-line bg-card px-3 py-1.5 text-[12.5px] font-semibold text-ink2 transition duration-180 hover:border-ink3 hover:-translate-y-px"
              >
                搜这套真题 ↗
              </a>
            </Card>
          ))}
        </div>
      </section>

      <Card className="mt-3.5 p-5">
        <h3 className="mb-3 text-[15px]">买之前先看这三条</h3>
        <div className="grid grid-cols-3 gap-3.5 max-[900px]:grid-cols-1">
          {TEXTBOOK_NOTES.map((n, i) => (
            <div key={n.title} className="rounded-xl border border-line bg-card2 px-4 py-3.5">
              <span className="text-xs font-semibold tracking-[0.5px] text-red">{`0${i + 1}`}</span>
              <h4 className="mt-0.5 text-sm">{n.title}</h4>
              <p className="mt-[5px] text-[12.5px] leading-relaxed text-ink3">{n.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

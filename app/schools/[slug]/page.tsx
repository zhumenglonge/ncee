import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SCHOOLS, getSchool } from '@/data/schools';
import { Card, Pill, Pills } from '@/components/ui';
import { FavoriteButton } from '@/components/FavoriteButton';

/** 路径参数只有 52 个，全部在构建期生成，其余一律 404 */
export const dynamicParams = false;

export function generateStaticParams() {
  return SCHOOLS.map((school) => ({ slug: school.id }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const school = getSchool(slug);
  if (!school) return { title: '院校不存在' };

  const description = `${school.name}（${school.city} · ${school.nature} · ${school.level}）：${school.intro} 优势专业 ${school.hot.slice(0, 3).join('、')}。`;

  return {
    title: `${school.name} 单招信息`,
    description,
    alternates: { canonical: `/schools/${school.id}/` },
    openGraph: { title: `${school.name} 单招信息`, description },
  };
}

export default async function SchoolDetailPage({ params }: Params) {
  const { slug } = await params;
  const school = getSchool(slug);
  if (!school) notFound();

  return (
    <div className="animate-fade-in">
      <Link href="/schools/" className="mb-3 inline-flex items-center gap-1 text-[13px] text-ink3 hover:text-ink">
        ← 返回院校库
      </Link>

      <Card className="mb-3.5 px-6 py-5">
        <h1 className="text-[22px] tracking-[-0.3px]">{school.name}</h1>
        <Pills className="mt-2.5">
          <Pill tone={school.nature === '公办' ? 'jade' : 'red'}>{school.nature}</Pill>
          <Pill>{school.city}</Pill>
          <Pill>{school.level}</Pill>
          {school.tags.map((tag) => (
            <Pill key={tag} tone="gold">
              {tag}
            </Pill>
          ))}
        </Pills>
      </Card>

      <Card className="px-6 py-5">
        <Section title="学校简介">
          <p>{school.intro}</p>
        </Section>

        <Section title="优势 / 特色专业">
          <ul className="list-disc pl-[18px]">
            {school.hot.map((item) => (
              <li key={item} className="mb-1">
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="单招参考">
          <dl className="grid grid-cols-[auto_1fr] gap-y-1.5 gap-x-3.5 text-[13.2px] max-[480px]:grid-cols-1 max-[480px]:gap-y-0.5">
            <dt className="whitespace-nowrap text-ink3 max-[480px]:mt-1.5">考试形式</dt>
            <dd>{school.exam}</dd>
            <dt className="whitespace-nowrap text-ink3 max-[480px]:mt-1.5">报考提示</dt>
            <dd>{school.tip}</dd>
          </dl>
        </Section>

        <Section title="备考建议">
          <p>
            先按「{school.hot[0]}」方向确定技能测试的准备重点，再对照学校往年简章确认是否有面试、体检或加试。
            招生计划每年都会调整，最终以学校官方网站发布的当年招生简章为准。
          </p>
        </Section>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <FavoriteButton id={school.id} />
          <a
            href={school.site}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-[11px] border border-line bg-card px-4 py-2.5 text-[13.5px] font-semibold transition hover:border-ink3"
          >
            学校官网 ↗
          </a>
          <Link
            href="/schools/"
            className="inline-flex items-center rounded-[11px] border border-line bg-card px-4 py-2.5 text-[13.5px] font-semibold transition hover:border-ink3"
          >
            看看其他院校
          </Link>
        </div>
      </Card>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-4">
      <h2 className="mb-1.5 text-xs font-bold tracking-[1.5px] text-red">{title}</h2>
      <div className="text-[13.8px] text-ink2">{children}</div>
    </section>
  );
}

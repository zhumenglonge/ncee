'use client';

import Link from 'next/link';
import { SCHOOLS, TIERS } from '@/data/schools';
import type { School } from '@/lib/types';
import { Card, Pill, Pills } from '@/components/ui';
import { FavoriteIcon } from '@/components/FavoriteButton';

function SchoolCard({ school }: { school: School }) {
  return (
    <Card className="flex flex-col gap-2.5 p-4 transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_18px_34px_-22px_rgba(27,26,23,.45)]">
      <div className="flex items-start justify-between gap-2">
        {/* 标题直达学校官网（新窗口打开），站内详情走卡片下方入口 */}
        <a href={school.site} target="_blank" rel="noopener noreferrer" className="hover:underline">
          <h3 className="text-[15px] tracking-[-0.2px]">
            {school.name}
            <span className="ml-[3px] text-[11px] text-ink3">↗</span>
          </h3>
        </a>
        <FavoriteIcon id={school.id} />
      </div>

      <Pills>
        <Pill tone={school.nature === '公办' ? 'jade' : 'red'}>{school.nature}</Pill>
        <Pill>{school.city}</Pill>
        {school.easyAdmit ? (
          <span title={`稳上岸理由：${school.easyAdmit}`} className="cursor-help">
            <Pill tone="jade">稳上岸</Pill>
          </span>
        ) : null}
        {typeof school.plan2026 === 'number' ? (
          <Pill tone="gold">2026 单招计划 {school.plan2026.toLocaleString('zh-CN')} 人</Pill>
        ) : (
          <Pill tone="gold">2026 单招计划以考试院公布为准</Pill>
        )}
      </Pills>

      <Link href={`/schools/${school.id}/`} className="block">
        <p className="line-clamp-3 min-h-[3.9em] text-[12.8px] text-ink3">{school.intro}</p>
      </Link>

      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="text-[11.5px] text-ink3">优势专业：{school.hot[0]}</span>
        <Link
          href={`/schools/${school.id}/`}
          className="rounded-[9px] border border-line bg-card px-3 py-1.5 text-[12.5px] font-semibold whitespace-nowrap transition hover:border-ink3"
        >
          查看详情
        </Link>
      </div>
    </Card>
  );
}

export function SchoolBrowser() {
  // 按梯队分块展示
  const groups = TIERS.map((tier) => ({
    ...tier,
    schools: SCHOOLS.filter((school) => school.tier === tier.key),
  })).filter((group) => group.schools.length > 0);

  return (
    <div className="grid gap-6">
      <Card className="flex flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2.5 text-[12px] text-ink3">
        <Pill tone="jade">稳上岸</Pill>
        <span>指往年单招录取率较高、报考竞争较小、更容易拿到全日制专科学历的公办院校（鼠标悬停可看理由）。当兵看的是「学历 + 身体 + 政审」、专业不限，所以先稳上岸拿学历是第一优先级。</span>
      </Card>
      {groups.map((group) => (
        <section key={group.key}>
          <div className="mb-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <h3 className="flex items-center gap-2 text-[15px] font-bold tracking-[-0.2px]">
              <span aria-hidden className="h-[14px] w-[3px] rounded-full bg-red" />
              {group.title}
            </h3>
            <span className="text-[11.5px] text-ink3">{group.schools.length} 所</span>
            <p className="w-full text-[12px] text-ink3">{group.desc}</p>
          </div>
          <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fill,minmax(288px,1fr))] max-[640px]:grid-cols-1">
            {group.schools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

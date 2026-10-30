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
        <Pill>{school.level}</Pill>
        {school.tags.slice(0, 2).map((tag) => (
          <Pill key={tag} tone="gold">
            {tag}
          </Pill>
        ))}
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

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CITIES, NATURES, SCHOOLS } from '@/data/schools';
import type { School } from '@/lib/types';
import { Card, Chip, Empty, Pill, Pills } from '@/components/ui';
import { FavoriteIcon } from '@/components/FavoriteButton';

const ALL = '全部';

function matchNature(school: School, nature: string): boolean {
  if (nature === ALL) return true;
  // 职业本科是按办学层次筛，不是按公办 / 民办筛
  if (nature === '职业本科') return school.level === '职业本科';
  return school.nature === nature;
}

function SchoolCard({ school }: { school: School }) {
  return (
    <Card className="flex flex-col gap-2.5 p-4 transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_18px_34px_-22px_rgba(27,26,23,.45)]">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/schools/${school.id}/`} className="hover:underline">
          <h3 className="text-[15px] tracking-[-0.2px]">{school.name}</h3>
        </Link>
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
  const [city, setCity] = useState<string>(ALL);
  const [nature, setNature] = useState<string>(ALL);
  const [keyword, setKeyword] = useState('');

  const list = useMemo(() => {
    const kw = keyword.trim();
    return SCHOOLS.filter((school) => {
      if (city !== ALL && school.city !== city) return false;
      if (!matchNature(school, nature)) return false;
      if (kw && !(school.name + school.hot.join('') + school.tags.join('')).includes(kw)) return false;
      return true;
    });
  }, [city, nature, keyword]);

  return (
    <>
      <Card className="mb-3.5 grid gap-[11px] px-[18px] py-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex min-w-[180px] flex-1 items-center gap-2 rounded-[11px] border border-line bg-card2 px-[13px] py-[9px]">
            <span className="text-ink3">🔍</span>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索学校名称或专业，如「铁道」「护理」"
              className="w-full border-0 bg-transparent text-[13.5px] outline-none placeholder:text-ink3"
            />
          </label>
          <span className="text-xs text-ink3">{list.length} 所院校</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-[34px] shrink-0 text-xs text-ink3 max-[640px]:w-auto">城市</span>
          {CITIES.map((item) => (
            <Chip key={item} active={city === item} onClick={() => setCity(item)}>
              {item}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="w-[34px] shrink-0 text-xs text-ink3 max-[640px]:w-auto">性质</span>
          {NATURES.map((item) => (
            <Chip key={item} active={nature === item} onClick={() => setNature(item)}>
              {item}
            </Chip>
          ))}
        </div>
      </Card>

      {list.length ? (
        <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fill,minmax(288px,1fr))] max-[640px]:grid-cols-1">
          {list.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      ) : (
        <Empty>没有匹配的院校，换个关键词或筛选条件试试</Empty>
      )}
    </>
  );
}

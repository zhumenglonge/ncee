import type { Metadata } from 'next';
import { Card, ViewHead } from '@/components/ui';
import { FaqAccordion } from '@/components/FaqAccordion';
import { TIMELINE } from '@/data/site';

export const metadata: Metadata = {
  title: '备考指南',
  description: '单招怎么考、一年怎么排、常见疑问一次说清：从打基础到定院校、志愿填报、校考、录取的时间轴。',
  alternates: { canonical: '/guide/' },
};

export default function GuidePage() {
  return (
    <div className="animate-fade-in">
      <ViewHead title="备考指南" desc="单招怎么考、一年怎么排、常见疑问一次说清。" />

      <div className="grid grid-cols-[1.35fr_1fr] items-start gap-3.5 max-[900px]:grid-cols-1">
        <Card className="p-5">
          <div className="mb-3.5 flex items-center justify-between">
            <h3 className="text-[15px]">一年备考节奏（参考）</h3>
          </div>

          <div className="relative pl-[26px] before:absolute before:top-1.5 before:bottom-1.5 before:left-[6px] before:w-0.5 before:bg-line before:content-['']">
            {TIMELINE.map((item) => (
              <div
                key={item.range}
                className="relative pb-5 before:absolute before:top-1.5 before:-left-[25px] before:size-2.5 before:rounded-full before:border-2 before:border-red before:bg-card before:content-[''] last:pb-0"
              >
                <span className="text-xs font-semibold tracking-[0.5px] text-red">{item.range}</span>
                <h4 className="text-sm">{item.title}</h4>
                <p className="mt-[3px] text-[13px] text-ink3">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3.5 flex items-center justify-between">
            <h3 className="text-[15px]">常见问题</h3>
          </div>
          <FaqAccordion />
          <p className="mt-4 rounded-xl border border-transparent bg-gold-soft px-4 py-3 text-xs text-ink3">
            本站院校与考试信息为备考整理版本，仅作参考；招生专业、计划与录取规则请以湖南省教育考试院及各校当年官方招生简章为最终依据。
          </p>
        </Card>
      </div>
    </div>
  );
}

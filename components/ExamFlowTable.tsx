import { Card } from '@/components/ui';
import { EXAM_FLOW, EXAM_OUTCOMES } from '@/data/site';
import { cn } from '@/lib/cn';

const outcomeTone = {
  jade: { box: 'bg-jade-soft', mark: 'bg-jade text-paper', text: 'text-jade' },
  gold: { box: 'bg-gold-soft', mark: 'bg-gold text-paper', text: 'text-gold' },
  red: { box: 'bg-red-soft', mark: 'bg-red text-on-red', text: 'text-red' },
} as const;

/** 首页的「报名与考试流程」表：从填报志愿到二志愿录取一屏看完 */
export function ExamFlowTable() {
  return (
    <Card className="mb-4 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 px-5 pt-4 pb-1">
        <h3 className="text-[15px]">报名与考试流程</h3>
        <span className="text-[11.5px] text-ink3">2027 届按往年节奏预估 · 次行为 2026 年实际日期</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <caption className="sr-only">湖南单招从填报志愿到第二志愿录取的完整流程</caption>
          <thead>
            <tr className="text-[11.5px] text-ink3">
              <th scope="col" className="w-[32%] border-t border-line px-5 py-2 font-semibold">
                时间
              </th>
              <th scope="col" className="border-t border-line px-5 py-2 font-semibold">
                你要做什么
              </th>
            </tr>
          </thead>
          <tbody>
            {EXAM_FLOW.map((row) => (
              <tr key={row.when} className="border-t border-line align-top">
                <th scope="row" className="px-5 py-2.5 font-normal">
                  <b className="block text-[12.5px]">{row.when}</b>
                  <span className="text-[11px] text-ink3 tabular-nums">{row.ref}</span>
                </th>
                <td className="px-5 py-2.5">
                  <p className="text-[12.5px] text-ink2">{row.what}</p>
                  {row.cond && (
                    <p className="mt-1 rounded-md bg-red-soft px-2 py-1 text-[11.5px] font-semibold text-red">
                      {row.cond}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-line px-5 pt-3">
        <h4 className="text-[12.5px] font-bold text-ink2">一志愿出结果后的三种结局</h4>
        <div className="mt-2 grid gap-2 min-[760px]:grid-cols-3">
          {EXAM_OUTCOMES.map((item) => {
            const tone = outcomeTone[item.tone];
            return (
              <div key={item.mark} className={cn('rounded-xl px-3 py-2', tone.box)}>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'grid size-[18px] shrink-0 place-items-center rounded-full text-[10.5px] font-bold',
                      tone.mark,
                    )}
                  >
                    {item.mark}
                  </span>
                  <b className={cn('text-[12.5px]', tone.text)}>{item.title}</b>
                </div>
                <p className="mt-1 text-[11.5px] leading-relaxed text-ink2">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="px-5 pt-2 pb-4 text-[11.5px] leading-relaxed text-ink3">
        顺序志愿：学校先录第一志愿考生，一志愿录满就不再组织第二志愿考试。所有日期均为预估，以省教育考试院公告和准考证为准。
      </p>
    </Card>
  );
}

import { Card } from '@/components/ui';
import { CountdownGrid } from '@/components/Countdown';
import { FeaturedSchools, ProgressCard, StatsRow, TodayTasks } from '@/components/OverviewWidgets';
import { getFeaturedSchools } from '@/data/schools';

export default function OverviewPage() {
  const featured = getFeaturedSchools();

  return (
    <div className="animate-fade-in">
      <div className="mb-4 grid grid-cols-[1.55fr_0.9fr] gap-4 max-[900px]:grid-cols-1">
        <Card className="relative overflow-hidden bg-[radial-gradient(120%_140%_at_100%_0%,var(--red-soft)_0%,transparent_55%)] px-7 py-[26px] max-[640px]:px-5 max-[640px]:py-[22px]">
          <div className="pointer-events-none absolute -right-10 -bottom-[70px] size-[230px] rounded-full border border-line opacity-90" />
          <div className="text-xs font-bold tracking-[2px] text-red">2027 湖南省高职单招</div>
          <h1 className="my-2 mb-1 font-serif text-[30px] tracking-[-0.5px] max-[640px]:text-2xl">
            把 <em className="text-red not-italic">3 月</em> 的考场，变成你的主场
          </h1>
          <p className="max-w-[44ch] text-[13.5px] text-ink3">
            院校信息、历年节奏、文化素质 + 职业技能双线刷题，一站式陪你把备考走完。
          </p>
          <CountdownGrid />
          <p className="mt-3 text-xs text-ink3">
            倒计时目标：2027 年单招校考预计时间（3 月中下旬）。实际以省教育考试院公告为准。
          </p>
        </Card>
        <ProgressCard />
      </div>

      <StatsRow />

      <div className="grid grid-cols-[1.35fr_1fr] items-start gap-3.5 max-[900px]:grid-cols-1">
        <TodayTasks />
        <FeaturedSchools schools={featured} />
      </div>
    </div>
  );
}

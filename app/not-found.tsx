import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="animate-fade-in rounded-card border border-line bg-card px-6 py-16 text-center shadow-card">
      <div className="text-[34px]">🧭</div>
      <h1 className="mt-2 text-xl">这个页面不存在</h1>
      <p className="mt-2 text-[13.5px] text-ink3">可能是院校 id 拼错了，回院校库重新找一下。</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        <Link
          href="/schools/"
          className="inline-flex items-center rounded-[11px] border border-red bg-red px-4 py-2.5 text-[13.5px] font-semibold text-on-red shadow-[0_8px_20px_-12px_var(--red)] transition hover:-translate-y-px"
        >
          去院校库
        </Link>
        <Link
          href="/"
          className="inline-flex items-center rounded-[11px] border border-line bg-card px-4 py-2.5 text-[13.5px] font-semibold transition hover:border-ink3"
        >
          回首页
        </Link>
      </div>
    </div>
  );
}

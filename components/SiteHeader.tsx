'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '@/data/site';
import { useAppState } from '@/lib/store';
import { cn } from '@/lib/cn';
import { CountdownPill } from '@/components/Countdown';
import { ThemeToggle } from '@/components/ThemeToggle';

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/' || pathname === '';
  return pathname === href || pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const { wrong } = useAppState();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/82 backdrop-blur-[14px] backdrop-saturate-[1.2]">
      <div className="mx-auto flex max-w-[1180px] items-center gap-[18px] px-5 py-2.5 max-[640px]:gap-2.5 max-[640px]:px-3 max-[640px]:py-2">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-[linear-gradient(150deg,var(--red),#8E1F19)] font-serif text-[21px] font-bold text-white shadow-[0_6px_16px_-8px_var(--red)]">
            湘
          </span>
          <span className="block max-[480px]:hidden">
            <span className="block text-[15px] font-extrabold tracking-[0.5px]">
              湘单招 <span className="text-red">2027</span>
            </span>
            <span className="block text-[11px] tracking-[0.5px] text-ink3 max-[640px]:hidden">
              湖南高职单招备考站
            </span>
          </span>
        </Link>

        <nav className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-[13px] py-2 text-sm whitespace-nowrap transition duration-[180ms] max-[480px]:px-2.5 max-[480px]:text-[13.5px]',
                isActive(pathname, item.href)
                  ? 'bg-ink font-semibold text-paper'
                  : 'text-ink2 hover:bg-card2 hover:text-ink',
              )}
            >
              {item.label}
              {item.href === '/wrong/' && wrong.length > 0 && (
                <span className="h-[18px] min-w-[18px] rounded-[9px] bg-red px-[5px] text-center text-[11px] leading-[18px] font-bold text-on-red">
                  {wrong.length}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <CountdownPill />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

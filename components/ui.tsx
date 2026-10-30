import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/* ---------------------------------------------------------- 容器 */

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('rounded-card border border-line bg-card shadow-card', className)} {...props} />;
}

export function Panel({ className, ...props }: ComponentProps<'div'>) {
  return <Card className={cn('p-5', className)} {...props} />;
}

export function ViewHead({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-[18px]">
      <h2 className="text-2xl tracking-[-0.3px]">{title}</h2>
      <p className="mt-[5px] text-[13.5px] text-ink3">{desc}</p>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-card border border-line bg-card px-5 py-[50px] text-center text-[13.5px] text-ink3">{children}</div>;
}

/* ---------------------------------------------------------- 标签 */

const pillTone = {
  plain: 'border-line2 bg-card2 text-ink2',
  red: 'border-transparent bg-red-soft text-red',
  jade: 'border-transparent bg-jade-soft text-jade',
  gold: 'border-transparent bg-gold-soft text-gold',
} as const;

export function Pill({
  tone = 'plain',
  className,
  children,
}: {
  tone?: keyof typeof pillTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={cn('rounded-md border px-2 py-0.5 text-[11px] whitespace-nowrap', pillTone[tone], className)}>
      {children}
    </span>
  );
}

export function Pills({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-wrap gap-1.5', className)}>{children}</div>;
}

/* ---------------------------------------------------------- 按钮 */

const btnVariant = {
  outline: 'border-line bg-card hover:border-ink3',
  primary: 'border-red bg-red text-on-red shadow-[0_8px_20px_-12px_var(--red)] hover:brightness-[1.06]',
  ink: 'border-ink bg-ink text-paper hover:border-ink',
} as const;

const btnSize = {
  md: 'rounded-[11px] px-4 py-2.5 text-[13.5px]',
  sm: 'rounded-[9px] px-3 py-1.5 text-[12.5px]',
} as const;

type ButtonProps = ComponentProps<'button'> & {
  variant?: keyof typeof btnVariant;
  size?: keyof typeof btnSize;
};

export function Button({ variant = 'outline', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 border font-semibold whitespace-nowrap transition duration-[180ms]',
        'hover:-translate-y-px disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45',
        btnVariant[variant],
        btnSize[size],
        className,
      )}
      {...props}
    />
  );
}

/* ---------------------------------------------------------- 筛选 chip */

export function Chip({
  active,
  className,
  ...props
}: ComponentProps<'button'> & { active: boolean }) {
  return (
    <button
      className={cn(
        'rounded-full border px-3 py-[5px] text-[12.5px] transition duration-150',
        active
          ? 'border-ink bg-ink font-semibold text-paper'
          : 'border-line bg-card text-ink2 hover:border-ink3',
        className,
      )}
      {...props}
    />
  );
}

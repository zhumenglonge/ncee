import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DrillPanel } from '@/components/DrillPanel';
import { Card, ViewHead } from '@/components/ui';

export const metadata: Metadata = {
  title: '刷题',
  description: '语文、数学、英语、职业适应性测试共 51 题，即时判分与解析，支持顺序练习、随机 10 题模拟、错题重做。',
  alternates: { canonical: '/drill/' },
};

export default function DrillPage() {
  return (
    <div className="animate-fade-in">
      <ViewHead
        title="刷题"
        desc="语文 · 数学 · 英语 · 职业适应性测试。点选项即判分并出解析，答错自动进错题本。"
      />
      {/* 读取 ?mode= 需要 useSearchParams，静态导出时必须包一层 Suspense */}
      <Suspense fallback={<Card className="h-40" />}>
        <DrillPanel />
      </Suspense>
    </div>
  );
}

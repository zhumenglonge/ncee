import type { Metadata } from 'next';
import { SchoolBrowser } from '@/components/SchoolBrowser';
import { ViewHead } from '@/components/ui';

export const metadata: Metadata = {
  title: '湖南单招院校库',
  description: '52 所湖南高职单招院校，按城市、办学性质筛选，含简介、优势专业、考试形式与报考提示。',
  alternates: { canonical: '/schools/' },
};

export default function SchoolsPage() {
  return (
    <div className="animate-fade-in">
      <ViewHead title="湖南单招院校库" desc="按城市、办学性质筛选，点开看简介、优势专业与单招参考信息。" />
      <SchoolBrowser />
    </div>
  );
}

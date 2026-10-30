import type { Metadata } from 'next';
import { SchoolBrowser } from '@/components/SchoolBrowser';

export const metadata: Metadata = {
  title: '湖南单招院校库',
  description: '52 所湖南高职单招院校，按冲刺、稳健、保底与民办四个梯队分组，点击院校名称直达学校官网。',
  alternates: { canonical: '/schools/' },
};

export default function SchoolsPage() {
  return (
    <div className="animate-fade-in">
      <SchoolBrowser />
    </div>
  );
}

import type { Metadata } from 'next';
import { ViewHead } from '@/components/ui';
import { WrongBook } from '@/components/WrongBook';

export const metadata: Metadata = {
  title: '错题本',
  description: '答错过的题会自动收进错题本，重做答对后可移出，支持手动增删。',
  alternates: { canonical: '/wrong/' },
};

export default function WrongPage() {
  return (
    <div className="animate-fade-in">
      <ViewHead title="错题本" desc="答错过的题会自动收进来，重做答对后可移出。" />
      <WrongBook />
    </div>
  );
}

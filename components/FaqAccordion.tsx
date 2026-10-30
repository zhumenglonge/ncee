'use client';

import { useState } from 'react';
import { FAQS } from '@/data/site';
import { cn } from '@/lib/cn';

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {FAQS.map((faq, i) => {
        const expanded = open === i;
        return (
          <div key={faq.q} className="border-t border-line py-[13px] first:border-t-0">
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : i)}
              className="flex w-full justify-between gap-2.5 text-left text-sm font-bold"
            >
              {faq.q}
              <i className={cn('not-italic text-ink3 transition duration-200', expanded && 'rotate-45')}>+</i>
            </button>
            <p
              className={cn(
                'overflow-hidden text-[13px] text-ink3 transition-all duration-200',
                expanded ? 'mt-2 max-h-60' : 'max-h-0',
              )}
            >
              {faq.a}
            </p>
          </div>
        );
      })}
    </div>
  );
}

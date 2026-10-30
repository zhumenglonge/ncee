'use client';

import { useEffect, useState } from 'react';
import { MOTTOS } from '@/data/site';

/** 随机取一条，排除当前这条，保证点「换一句」一定有变化 */
function randomIndex(exclude?: number): number {
  if (MOTTOS.length <= 1) return 0;
  let next = Math.floor(Math.random() * MOTTOS.length);
  while (next === exclude) next = Math.floor(Math.random() * MOTTOS.length);
  return next;
}

/**
 * 首屏励志句：每次进入随机一条，也可以点按钮换一句。
 * 静态导出的首帧必须是确定的，所以先渲染第 0 句保证水合一致，
 * 挂载后再换成随机句；min-h 固定两行，换句时不会把下面的内容顶动。
 */
export function MottoLine() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(randomIndex());
  }, []);

  const motto = MOTTOS[index];

  return (
    <p
      key={index}
      className="min-h-[3.3em] max-w-[46ch] animate-fade-in text-[13.5px] leading-relaxed text-ink2"
    >
      {motto.text}
      {motto.source && <span className="ml-1 text-[11.5px] text-ink3">— {motto.source}</span>}
      <button
        type="button"
        onClick={() => setIndex((cur) => randomIndex(cur))}
        aria-label="换一句"
        title="换一句"
        className="ml-1.5 inline-grid size-[19px] -translate-y-px place-items-center rounded-full border border-line bg-card align-middle text-[11px] leading-none text-ink3 transition duration-150 hover:border-red hover:text-red active:scale-95"
      >
        ↻
      </button>
    </p>
  );
}

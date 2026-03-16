'use client';

import Link from 'next/link';

const SPICE_STYLES = {
  MILD: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border border-amber-200',
  HOT: 'bg-orange-50 text-orange-700 border border-orange-200',
  EXTRA_HOT: 'bg-red-50 text-red-700 border border-red-200',
};

export default function DishCard({ dish }) {
  const spiceLabel =
    dish.spiceLevel === 'EXTRA_HOT'
      ? `🌶️ ${dish.spiceLevel.replace('_', ' ')}`
      : dish.spiceLevel;

  return (
    <Link href={`/dishes/${dish.id}`}>
      <div
        className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-0.5 active:scale-[0.98]"
        style={{
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        {/* Image area — warm gradient placeholder */}
        <div
          className="aspect-[4/3] relative flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FEE2E2 50%, #FDF4FF 100%)',
          }}
        >
          <span className="text-[32px] opacity-30 select-none">🍽️</span>

          {/* Spice badge — pinned top-right */}
          {dish.spiceLevel && (
            <span
              className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                SPICE_STYLES[dish.spiceLevel] || SPICE_STYLES.MILD
              }`}
            >
              {spiceLabel}
            </span>
          )}
        </div>

        {/* Text area */}
        <div className="p-3">
          <h3 className="text-sm font-bold text-[#1C1917] leading-snug line-clamp-2">
            {dish.name}
          </h3>
          {dish.nameUrdu && (
            <p
              className="text-xs text-[#A8A29E] text-right mt-1 leading-relaxed"
              style={{ direction: 'rtl', fontFamily: 'var(--font-urdu), serif' }}
            >
              {dish.nameUrdu}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

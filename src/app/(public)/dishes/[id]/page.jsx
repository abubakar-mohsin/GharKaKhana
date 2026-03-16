'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

const SPICE_STYLES = {
  MILD: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  HOT: 'bg-orange-50 text-orange-700 border-orange-200',
  EXTRA_HOT: 'bg-red-50 text-red-700 border-red-200',
};

const MEAL_LABELS = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SNACK: 'Snack',
};

async function fetchDish(id) {
  const res = await fetch(`/api/dishes/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('NOT_FOUND');
    throw new Error('Failed to fetch dish');
  }
  return res.json();
}

export default function DishDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: dish, isLoading, error } = useQuery({
    queryKey: ['dish', id],
    queryFn: () => fetchDish(id),
    enabled: !!id,
  });

  // ── Loading state ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: '#F7F4EF' }}>
        <header className="px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full shimmer" />
          <div className="h-5 w-32 rounded shimmer" />
        </header>
        <div className="aspect-[16/9] shimmer" />
        <div className="px-4 pt-5 space-y-3">
          <div className="h-7 w-3/4 rounded shimmer" />
          <div className="h-5 w-1/2 rounded shimmer" />
          <div className="h-4 w-full rounded shimmer" />
          <div className="h-4 w-5/6 rounded shimmer" />
        </div>
      </div>
    );
  }

  // ── Error / Not found ──────────────────────────────────────────
  if (error || !dish) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#F7F4EF' }}>
        <span className="text-[64px] mb-4">🍽️</span>
        <h1 className="text-xl font-bold text-[#1C1917] mb-2">
          {error?.message === 'NOT_FOUND' ? 'Dish not found' : 'Something went wrong'}
        </h1>
        <p className="text-sm text-[#78716C] mb-6">
          {error?.message === 'NOT_FOUND'
            ? 'This dish may have been removed.'
            : 'Please try again later.'}
        </p>
        <Link
          href="/dishes"
          className="rounded-full border-[1.5px] border-[#7C3AED] text-[#7C3AED] px-6 py-2.5 text-sm font-semibold hover:bg-[#7C3AED] hover:text-white transition-all"
        >
          Back to dishes
        </Link>
      </div>
    );
  }

  const spiceLabel =
    dish.spiceLevel === 'EXTRA_HOT'
      ? `🌶️ Extra Hot`
      : dish.spiceLevel?.charAt(0) + dish.spiceLevel?.slice(1).toLowerCase();

  const formatBase = (type) =>
    type?.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || '';

  return (
    <div className="min-h-screen pb-10" style={{ background: '#F7F4EF' }}>
      {/* ── Top bar ──── */}
      <header className="px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#78716C] hover:text-[#1C1917] transition-colors"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <span className="text-[#1C1917] font-bold text-base">Dish Detail</span>
      </header>

      {/* ── Hero image area ──── */}
      <div
        className="aspect-[16/9] relative flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FEE2E2 50%, #FDF4FF 100%)' }}
      >
        <span className="text-[56px] opacity-30 select-none">🍽️</span>

        {/* Spice badge */}
        {dish.spiceLevel && (
          <span
            className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase border ${
              SPICE_STYLES[dish.spiceLevel] || SPICE_STYLES.MILD
            }`}
          >
            {spiceLabel}
          </span>
        )}
      </div>

      {/* ── Content ──── */}
      <div className="px-4 pt-5">
        {/* Name */}
        <h1 className="text-2xl font-extrabold text-[#1C1917] leading-tight">
          {dish.name}
        </h1>

        {/* Urdu name */}
        {dish.nameUrdu && (
          <p
            className="text-base text-[#A8A29E] mt-1 leading-relaxed"
            style={{ direction: 'rtl', fontFamily: 'var(--font-urdu), serif', textAlign: 'right' }}
          >
            {dish.nameUrdu}
          </p>
        )}

        {/* Description */}
        {dish.description && (
          <p className="text-sm text-[#78716C] mt-3 leading-relaxed">
            {dish.description}
          </p>
        )}

        {/* ── Info pills ──── */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="rounded-full bg-[#EDE9FE] text-[#7C3AED] px-3 py-1 text-xs font-semibold">
            {formatBase(dish.baseType)}
          </span>
          <span className="rounded-full bg-[#EDE9FE] text-[#7C3AED] px-3 py-1 text-xs font-semibold">
            {dish.dietaryType?.replace('_', '-').replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
          {dish.proteinType && dish.proteinType !== 'NONE' && (
            <span className="rounded-full bg-[#EDE9FE] text-[#7C3AED] px-3 py-1 text-xs font-semibold">
              {dish.proteinType?.charAt(0) + dish.proteinType?.slice(1).toLowerCase()}
            </span>
          )}
          {dish.region && (
            <span className="rounded-full bg-orange-50 text-orange-700 px-3 py-1 text-xs font-semibold">
              {dish.region}
            </span>
          )}
        </div>

        {/* ── Quick stats row ──── */}
        <div
          className="grid grid-cols-3 gap-3 mt-5 p-4 rounded-2xl bg-white"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <div className="text-center">
            <p className="text-lg font-bold text-[#1C1917]">
              {dish.prepTimeMinutes ? `${dish.prepTimeMinutes}m` : '—'}
            </p>
            <p className="text-[10px] text-[#A8A29E] uppercase tracking-wide font-medium">Prep Time</p>
          </div>
          <div className="text-center border-x border-[#E7E5E4]">
            <p className="text-lg font-bold text-[#1C1917]">
              {dish.isQuick ? 'Yes' : 'No'}
            </p>
            <p className="text-[10px] text-[#A8A29E] uppercase tracking-wide font-medium">Quick</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#1C1917]">
              {dish.isFestive ? 'Yes' : 'No'}
            </p>
            <p className="text-[10px] text-[#A8A29E] uppercase tracking-wide font-medium">Festive</p>
          </div>
        </div>

        {/* ── Meal times ──── */}
        {dish.mealTimes?.length > 0 && (
          <div className="mt-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#A8A29E] mb-2">
              Meal Times
            </h2>
            <div className="flex flex-wrap gap-2">
              {dish.mealTimes.map((time) => (
                <span
                  key={time}
                  className="rounded-full bg-white border border-[#E7E5E4] text-[#44403C] px-3 py-1 text-xs font-medium"
                >
                  {MEAL_LABELS[time] || time}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Tags ──── */}
        {dish.tags?.length > 0 && (
          <div className="mt-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#A8A29E] mb-2">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {dish.tags.map((t) => (
                <span
                  key={t.id || t.tag}
                  className="rounded-full bg-[#EDE9FE] text-[#7C3AED] px-3 py-1 text-xs font-medium"
                >
                  {t.tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Nutrition ──── */}
        {dish.nutrition && (
          <div className="mt-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#A8A29E] mb-2">
              Nutrition (per serving)
            </h2>
            {dish.nutrition.servingDescription && (
              <p className="text-xs text-[#78716C] mb-3">
                Serving: {dish.nutrition.servingDescription}
              </p>
            )}
            <div
              className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              {dish.nutrition.calories != null && (
                <div>
                  <p className="text-lg font-bold text-[#1C1917]">{dish.nutrition.calories}</p>
                  <p className="text-[10px] text-[#A8A29E] uppercase tracking-wide font-medium">Calories</p>
                </div>
              )}
              {dish.nutrition.protein != null && (
                <div>
                  <p className="text-lg font-bold text-[#1C1917]">{dish.nutrition.protein}g</p>
                  <p className="text-[10px] text-[#A8A29E] uppercase tracking-wide font-medium">Protein</p>
                </div>
              )}
              {dish.nutrition.carbohydrates != null && (
                <div>
                  <p className="text-lg font-bold text-[#1C1917]">{dish.nutrition.carbohydrates}g</p>
                  <p className="text-[10px] text-[#A8A29E] uppercase tracking-wide font-medium">Carbs</p>
                </div>
              )}
              {dish.nutrition.fat != null && (
                <div>
                  <p className="text-lg font-bold text-[#1C1917]">{dish.nutrition.fat}g</p>
                  <p className="text-[10px] text-[#A8A29E] uppercase tracking-wide font-medium">Fat</p>
                </div>
              )}
              {dish.nutrition.fiber != null && (
                <div>
                  <p className="text-lg font-bold text-[#1C1917]">{dish.nutrition.fiber}g</p>
                  <p className="text-[10px] text-[#A8A29E] uppercase tracking-wide font-medium">Fiber</p>
                </div>
              )}
            </div>
            <p className="text-[10px] text-[#A8A29E] mt-2 italic">
              * Nutritional values are approximate estimates
            </p>
          </div>
        )}

        {/* ── Recipe ──── */}
        {dish.recipe && (
          <div className="mt-5">
            {/* Ingredients */}
            {dish.recipe.ingredients && (
              <div className="mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#A8A29E] mb-2">
                  Ingredients
                  {dish.recipe.servings && (
                    <span className="normal-case tracking-normal font-normal"> (serves {dish.recipe.servings})</span>
                  )}
                </h2>
                <div
                  className="p-4 rounded-2xl bg-white space-y-2"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                >
                  {(Array.isArray(dish.recipe.ingredients) ? dish.recipe.ingredients : []).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-[#44403C]">
                      <span className="text-[#7C3AED] mt-0.5">•</span>
                      <span>{typeof item === 'string' ? item : item.name || JSON.stringify(item)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Steps */}
            {dish.recipe.steps && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#A8A29E] mb-2">
                  Instructions
                </h2>
                <div
                  className="p-4 rounded-2xl bg-white space-y-4"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                >
                  {(Array.isArray(dish.recipe.steps) ? dish.recipe.steps : []).map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-sm text-[#44403C] leading-relaxed">
                        {typeof step === 'string' ? step : step.instruction || JSON.stringify(step)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

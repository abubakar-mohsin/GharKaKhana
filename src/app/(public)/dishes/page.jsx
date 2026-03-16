'use client';

import { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import DishCard from '@/components/DishCard';
import DishSkeleton from '@/components/DishSkeleton';
import FilterChips from '@/components/FilterChips';

// ── Filter definitions ──────────────────────────────────────────────────────
const BASE_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Roti', value: 'roti' },
  { label: 'Rice', value: 'rice' },
  { label: 'Both', value: 'both' },
  { label: 'Standalone', value: 'standalone' },
];

const DIETARY_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Veg', value: 'veg' },
  { label: 'Non-veg', value: 'non_veg' },
  { label: 'Vegan', value: 'vegan' },
];

const SPICE_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Mild', value: 'mild' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hot', value: 'hot' },
  { label: 'Extra hot', value: 'extra_hot' },
];

const PROTEIN_OPTIONS = [
  { label: 'Chicken', value: 'chicken' },
  { label: 'Mutton', value: 'mutton' },
  { label: 'Beef', value: 'beef' },
  { label: 'Fish', value: 'fish' },
  { label: 'Lentil', value: 'lentil' },
  { label: 'Egg', value: 'egg' },
];

// ── Fetch function ──────────────────────────────────────────────────────────
async function fetchDishes({ pageParam, queryKey }) {
  const [, filters] = queryKey;
  const params = new URLSearchParams();

  if (filters.q) params.set('q', filters.q);
  if (filters.base) params.set('base', filters.base);
  if (filters.dietary) params.set('dietary', filters.dietary);
  if (filters.spice) params.set('spice', filters.spice);
  if (filters.protein) params.set('protein', filters.protein);
  if (pageParam) params.set('cursor', pageParam);

  const res = await fetch(`/api/dishes?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch dishes');
  return res.json();
}

// ── Inner component (uses useSearchParams) ──────────────────────────────────
function DishesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef(null);

  // Read filters from URL
  const q = searchParams.get('q') || '';
  const base = searchParams.get('base') || null;
  const dietary = searchParams.get('dietary') || null;
  const spice = searchParams.get('spice') || null;
  const protein = searchParams.get('protein') || null;

  const [searchInput, setSearchInput] = useState(q);

  // Sync searchInput if URL changes externally
  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  // URL update helper
  const updateParams = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key, value);
      }
      params.delete('cursor');
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // Debounced search
  const handleSearch = useCallback(
    (value) => {
      setSearchInput(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateParams('q', value || null);
      }, 300);
    },
    [updateParams]
  );

  // Clear all filters
  const clearAll = useCallback(() => {
    setSearchInput('');
    router.replace('?', { scroll: false });
  }, [router]);

  // Build filter object for query key (only non-empty values)
  const cleanFilters = {};
  if (q) cleanFilters.q = q;
  if (base) cleanFilters.base = base;
  if (dietary) cleanFilters.dietary = dietary;
  if (spice) cleanFilters.spice = spice;
  if (protein) cleanFilters.protein = protein;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['dishes', cleanFilters],
    queryFn: fetchDishes,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
  });

  const dishes = data?.pages.flatMap((page) => page.data) || [];

  // Parse protein multi-select from URL
  const proteinSelected = protein ? protein.split(',') : null;

  return (
    <div className="w-full pb-8" style={{ background: '#F7F4EF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Page heading ──────────────────────────────────────── */}
        <h1
          className="text-[32px] font-extrabold text-[#1C1917] mb-4 pt-6"
          style={{ letterSpacing: '-0.5px' }}
        >
          Dishes
        </h1>

        {/* ── Search bar ───────────────────────────────────────── */}
        <div className="relative mb-4">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E] pointer-events-none"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>

          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search biryani, karahi, paratha…"
            className="w-full h-[52px] rounded-full bg-white border-[1.5px] border-[#E7E5E4] pl-11 pr-10 text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_#EDE9FE] transition-all"
          />

          {searchInput && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#F5F5F4] flex items-center justify-center text-[#78716C] hover:bg-[#E7E5E4] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Filter bar ────────────────────────────────────────── */}
        <div className="py-3 space-y-2.5 mb-4">
          <FilterChips
            label="Base"
            options={BASE_OPTIONS}
            selected={base}
            onSelect={(val) => updateParams('base', val)}
          />
          <FilterChips
            label="Dietary"
            options={DIETARY_OPTIONS}
            selected={dietary}
            onSelect={(val) => updateParams('dietary', val)}
          />
          <FilterChips
            label="Spice"
            options={SPICE_OPTIONS}
            selected={spice}
            onSelect={(val) => updateParams('spice', val)}
          />
          <FilterChips
            label="Protein"
            options={PROTEIN_OPTIONS}
            selected={proteinSelected}
            onSelect={(val) => updateParams('protein', val)}
            multi
          />
        </div>

        {/* ── Content area ─────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <DishSkeleton key={i} />
            ))}
          </div>
        ) : dishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-[64px] mb-4">🍽️</span>
            <h2 className="text-lg font-bold text-[#1C1917] mb-1">No dishes found</h2>
            <p className="text-sm text-[#78716C] mb-6">Try adjusting your filters</p>
            <button
              onClick={clearAll}
              className="rounded-full border-[1.5px] border-[#7C3AED] text-[#7C3AED] px-6 py-2.5 text-sm font-semibold hover:bg-[#7C3AED] hover:text-white transition-all"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {dishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>

            {hasNextPage && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="rounded-full border-[1.5px] border-[#7C3AED] text-[#7C3AED] px-9 py-2.5 text-sm font-semibold hover:bg-[#7C3AED] hover:text-white transition-all disabled:pointer-events-none"
                >
                  {isFetchingNextPage ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    'Load more'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Page wrapper with Suspense boundary for useSearchParams ─────────────────
export default function DishesPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full" style={{ background: '#F7F4EF' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <h1 className="text-[32px] font-extrabold text-[#1C1917] mb-4" style={{ letterSpacing: '-0.5px' }}>Dishes</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <DishSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <DishesContent />
    </Suspense>
  );
}

'use client';

export default function DishSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-[4/3] shimmer" />

      {/* Text placeholders */}
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 rounded shimmer" />
        <div className="h-3 w-1/2 rounded shimmer ml-auto" />
      </div>
    </div>
  );
}

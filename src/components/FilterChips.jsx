'use client';

export default function FilterChips({ label, options, selected, onSelect, multi = false }) {
  const handleClick = (value) => {
    if (value === 'ALL') {
      onSelect(null);
      return;
    }

    if (multi) {
      // Multi-select: toggle the value in/out of the array
      const current = selected || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      onSelect(next.length > 0 ? next : null);
    } else {
      // Single-select: toggle off if already selected, otherwise set
      onSelect(selected === value ? null : value);
    }
  };

  const isActive = (value) => {
    if (value === 'ALL') {
      return multi ? !selected || selected.length === 0 : !selected;
    }
    if (multi) {
      return selected?.includes(value) || false;
    }
    return selected === value;
  };

  return (
    <div className="flex items-center gap-3">
      {/* Fixed-width label */}
      <span className="text-[10px] font-semibold tracking-widest uppercase text-[#A8A29E] min-w-[60px] shrink-0">
        {label}
      </span>

      {/* Scrollable chips */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleClick(option.value)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] transition-all duration-150 ease-in-out ${
              isActive(option.value)
                ? 'bg-[#7C3AED] text-white font-semibold shadow-sm'
                : 'bg-white border border-[#E7E5E4] text-[#44403C] font-medium hover:border-[#7C3AED] hover:text-[#7C3AED]'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search titles, descriptions, genres...',
  debounceMs = 300,
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const isFirstRender = useRef(true);

  // Sync internal state if prop value changes externally (e.g. reset filters or URL navigation)
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Debounce notification back to parent
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onChange(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, onChange, debounceMs]);

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
  };

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className={[
          'w-full rounded-2xl bg-surface-800 border border-surface-700/80 pl-11 pr-10 py-3.5 text-sm text-white',
          'placeholder-text-muted shadow-lg shadow-black/20 backdrop-blur-md',
          'transition-all duration-200 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/30',
        ].join(' ')}
      />

      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-muted hover:text-white transition-colors"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-700 text-xs font-bold">
            ✕
          </span>
        </button>
      )}
    </div>
  );
};

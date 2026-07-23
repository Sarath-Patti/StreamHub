import React, { useState } from 'react';
import type { Content } from '@/types';
import { Badge } from '@/components/ui';

interface MovieCardProps {
  content: Content;
  className?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({ content, className = '' }) => {
  const [imageError, setImageError] = useState(false);

  const formattedRating = content.rating ? content.rating.toFixed(1) : null;
  const isMovie = content.type === 'MOVIE';

  return (
    <div
      className={[
        'group relative flex flex-col overflow-hidden rounded-xl bg-surface-800 border border-surface-700/60 shadow-md',
        'transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-500/40',
        className,
      ].join(' ')}
    >
      {/* Poster / Aspect ratio container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-900">
        {content.posterUrl && !imageError ? (
          <img
            src={content.posterUrl}
            alt={content.title}
            onError={() => setImageError(true)}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center gradient-brand opacity-90">
            <span className="text-3xl font-bold text-white/90">
              {content.title.charAt(0).toUpperCase()}
            </span>
            <span className="mt-2 text-xs font-semibold text-white/80 line-clamp-2">
              {content.title}
            </span>
          </div>
        )}

        {/* Top Badges overlay */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <Badge
            variant={isMovie ? 'brand' : 'accent'}
            className="backdrop-blur-md bg-surface-900/70 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5"
          >
            {content.type}
          </Badge>

          {formattedRating && (
            <Badge
              variant="warning"
              className="backdrop-blur-md bg-surface-900/70 text-[11px] font-bold px-2 py-0.5 flex items-center gap-1"
            >
              <span className="text-yellow-400">★</span> {formattedRating}
            </Badge>
          )}
        </div>

        {/* Hover overlay description */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-surface-900 via-surface-900/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed mb-2">
            {content.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {content.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="rounded-full bg-surface-700/80 px-2 py-0.5 text-[10px] text-text-muted font-medium"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="flex flex-1 flex-col p-3.5 justify-between">
        <div>
          <h3
            className="text-sm font-semibold text-white truncate group-hover:text-brand-300 transition-colors"
            title={content.title}
          >
            {content.title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
            <span>{content.releaseYear}</span>
            {content.duration && (
              <>
                <span>•</span>
                <span>{content.duration} min</span>
              </>
            )}
            <span>•</span>
            <span className="uppercase text-[10px] font-medium tracking-wide">
              {content.language}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

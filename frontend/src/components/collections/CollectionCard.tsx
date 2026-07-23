import React from 'react';
import { Link } from 'react-router-dom';
import type { Collection } from '@/services/collection';
import { Badge } from '@/components/ui';

interface CollectionCardProps {
  collection: Collection;
  onEdit?: (collection: Collection) => void;
  onDelete?: (collectionId: string) => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface-800 border border-surface-700/60 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-brand-500/40">
      {/* Cover Image Aspect Preview */}
      <Link to={`/collections/${collection.id}`} className="relative aspect-[16/9] w-full overflow-hidden bg-surface-900">
        {collection.coverImage ? (
          <img
            src={collection.coverImage}
            alt={collection.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center gradient-brand opacity-90">
            <span className="text-4xl font-black text-white/90">
              {collection.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <Badge
            variant={collection.visibility === 'PUBLIC' ? 'brand' : 'neutral'}
            className="backdrop-blur-md bg-surface-900/80 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5"
          >
            {collection.visibility}
          </Badge>

          <Badge variant="neutral" className="backdrop-blur-md bg-surface-900/80 text-xs font-bold px-2.5 py-0.5">
            {collection.contentCount} {collection.contentCount === 1 ? 'item' : 'items'}
          </Badge>
        </div>
      </Link>

      {/* Card Info */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-3">
        <div>
          <Link
            to={`/collections/${collection.id}`}
            className="text-base font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1"
          >
            {collection.name}
          </Link>
          <p className="text-xs text-text-muted line-clamp-2 mt-1 leading-relaxed">
            {collection.description || 'No description provided.'}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-surface-700/60 pt-3 text-[11px] text-text-muted">
          <span>Updated {new Date(collection.updatedAt).toLocaleDateString()}</span>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(collection)}
                className="text-text-secondary hover:text-white transition-colors"
                title="Edit collection"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete collection "${collection.name}"?`)) {
                    onDelete(collection.id);
                  }
                }}
                className="text-text-secondary hover:text-red-400 transition-colors"
                title="Delete collection"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

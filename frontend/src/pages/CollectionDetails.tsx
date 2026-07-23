import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Content } from '@/types';
import { useCollection } from '@/hooks/useCollection';
import { MovieCard } from '@/components/discover/MovieCard';
import { SearchBar } from '@/components/discover/SearchBar';
import { CreateEditCollectionModal } from '@/components/collections';
import type { CollectionVisibility } from '@/services/collection';
import { Badge, Button } from '@/components/ui';

export const CollectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { collection, removeContent, updateCollection, deleteCollection } = useCollection(id || '');

  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (!collection) return [];
    if (!itemSearchQuery.trim()) return collection.items;
    const q = itemSearchQuery.trim().toLowerCase();
    return collection.items.filter(
      (item: Content) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.genres.some((g: { name: string }) => g.name.toLowerCase().includes(q))
    );
  }, [collection, itemSearchQuery]);

  if (!collection) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
        <div className="text-4xl">📂</div>
        <h2 className="text-2xl font-bold text-white">Collection Not Found</h2>
        <p className="text-sm text-text-secondary">
          The requested collection does not exist or has been deleted.
        </p>
        <Link to="/collections">
          <Button variant="primary" size="md" className="mt-2">
            ← Back to Collections
          </Button>
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete collection "${collection.name}"?`)) {
      deleteCollection();
      navigate('/collections');
    }
  };

  const handleEditSubmit = (data: {
    name: string;
    description: string;
    visibility: CollectionVisibility;
    coverImage?: string;
  }) => {
    updateCollection(data);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-text-muted">
        <Link to="/collections" className="hover:text-white transition-colors">
          Collections
        </Link>
        <span>/</span>
        <span className="text-text-secondary truncate">{collection.name}</span>
      </nav>

      {/* Hero Collection Header */}
      <section className="relative overflow-hidden rounded-3xl bg-surface-800 border border-surface-700/60 p-6 sm:p-10 shadow-2xl">
        {collection.coverImage && (
          <div className="absolute inset-0 z-0 opacity-15 overflow-hidden">
            <img
              src={collection.coverImage}
              alt=""
              className="h-full w-full object-cover blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-800 via-surface-800/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant={collection.visibility === 'PUBLIC' ? 'brand' : 'neutral'} className="text-xs uppercase font-bold">
                {collection.visibility}
              </Badge>
              <Badge variant="neutral" className="text-xs">
                {collection.contentCount} {collection.contentCount === 1 ? 'item' : 'items'}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {collection.name}
            </h1>

            <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
              {collection.description || 'No description provided for this workspace collection.'}
            </p>

            <p className="text-xs text-text-muted">
              Last updated {new Date(collection.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button variant="secondary" size="sm" onClick={() => setIsEditModalOpen(true)}>
              ✏️ Edit Collection
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              🗑️ Delete
            </Button>
          </div>
        </div>
      </section>

      {/* Item Search Bar */}
      <SearchBar
        value={itemSearchQuery}
        onChange={setItemSearchQuery}
        placeholder={`Search titles within "${collection.name}"...`}
      />

      {/* Content Items Grid */}
      {collection.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-surface-700/60 bg-surface-800/40 p-12 text-center shadow-inner">
          <div className="text-3xl mb-3">🎬</div>
          <h3 className="text-lg font-bold text-white mb-1">This collection is empty</h3>
          <p className="text-sm text-text-secondary max-w-md mb-6">
            Browse the catalog or search for movies and series, then click "+ Add to Collection" to populate this workspace.
          </p>
          <Link to="/discover">
            <Button variant="primary" size="md">
              Explore Content
            </Button>
          </Link>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-surface-700/60 bg-surface-800/40 p-8 text-center text-sm text-text-muted">
          No titles inside "{collection.name}" match "{itemSearchQuery}".
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>
              Showing <span className="font-semibold text-white">{filteredItems.length}</span> titles
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredItems.map((item: Content) => (
              <div key={item.id} className="relative group">
                {/* Remove button overlay */}
                <button
                  type="button"
                  onClick={() => removeContent(item.id)}
                  title="Remove from collection"
                  className="absolute top-2 left-2 z-30 rounded-full bg-surface-900/90 text-red-400 hover:text-white hover:bg-red-600 h-6 w-6 flex items-center justify-center text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>

                <MovieCard content={item} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Collection Modal */}
      <CreateEditCollectionModal
        isOpen={isEditModalOpen}
        collectionToEdit={collection}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default CollectionDetails;

import React, { useState } from 'react';
import { useCollections } from '@/hooks/useCollections';
import type { Collection, CollectionVisibility } from '@/services/collection';
import { CollectionCard, CreateEditCollectionModal } from '@/components/collections';
import { SearchBar } from '@/components/discover/SearchBar';
import { Button } from '@/components/ui';

export const Collections: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    collections,
    createCollection,
    updateCollection,
    deleteCollection,
  } = useCollections(searchQuery);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const handleOpenCreate = () => {
    setEditingCollection(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: {
    name: string;
    description: string;
    visibility: CollectionVisibility;
    coverImage?: string;
  }) => {
    if (editingCollection) {
      updateCollection(editingCollection.id, data);
    } else {
      createCollection(data);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Discovery <span className="gradient-text">Workspaces</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Organize movies and series into personal custom collections.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenCreate} className="self-start md:self-auto">
          + New Collection
        </Button>
      </div>

      {/* Collection Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search collections by name..."
      />

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-surface-700/60 bg-surface-800/40 p-12 text-center shadow-inner">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-700/60 text-3xl mb-4">
            📚
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {searchQuery ? 'No matching collections' : 'No collections yet'}
          </h3>
          <p className="text-sm text-text-secondary max-w-md mb-6">
            {searchQuery
              ? `No collections matched "${searchQuery}". Try a different name.`
              : 'Create your first custom collection to group your favorite movies and TV series.'}
          </p>
          <Button variant="primary" size="md" onClick={handleOpenCreate}>
            + Create Collection
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>
              Showing <span className="font-semibold text-white">{collections.length}</span> collections
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((col) => (
              <CollectionCard
                key={col.id}
                collection={col}
                onEdit={handleOpenEdit}
                onDelete={deleteCollection}
              />
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <CreateEditCollectionModal
        isOpen={isModalOpen}
        collectionToEdit={editingCollection}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default Collections;

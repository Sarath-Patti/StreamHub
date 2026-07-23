import React, { useState, useEffect } from 'react';
import type { Collection, CollectionVisibility } from '@/services/collection';
import { Input, Button } from '@/components/ui';

interface CreateEditCollectionModalProps {
  isOpen: boolean;
  collectionToEdit?: Collection | null;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    visibility: CollectionVisibility;
    coverImage?: string;
  }) => void;
}

export const CreateEditCollectionModal: React.FC<CreateEditCollectionModalProps> = ({
  isOpen,
  collectionToEdit,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<CollectionVisibility>('PRIVATE');
  const [coverImage, setCoverImage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (collectionToEdit) {
      setName(collectionToEdit.name);
      setDescription(collectionToEdit.description);
      setVisibility(collectionToEdit.visibility);
      setCoverImage(collectionToEdit.coverImage || '');
    } else {
      setName('');
      setDescription('');
      setVisibility('PRIVATE');
      setCoverImage('');
    }
    setError(null);
  }, [collectionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Collection name is required.');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      visibility,
      coverImage: coverImage.trim() || undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-card max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-surface-600"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-700/60 pb-4">
          <h3 className="text-xl font-bold text-white">
            {collectionToEdit ? 'Edit Collection' : 'Create New Collection'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 font-medium">
              {error}
            </div>
          )}

          <Input
            label="Collection Name"
            placeholder="e.g. Sci-Fi Masterpieces, Weekend Binge"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="col-description-input" className="text-xs font-semibold text-text-secondary">
              Description (Optional)
            </label>
            <textarea
              id="col-description-input"
              rows={3}
              placeholder="Describe the themes or purpose of this collection..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg bg-surface-800 border border-surface-600 px-3.5 py-2.5 text-sm text-white placeholder-text-muted transition-all focus:border-brand-400 focus:outline-none"
            />
          </div>

          <Input
            label="Cover Image URL (Optional)"
            placeholder="https://images.unsplash.com/..."
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Visibility</label>
            <div className="flex gap-3">
              {(['PRIVATE', 'PUBLIC'] as const).map((vis) => (
                <button
                  key={vis}
                  type="button"
                  onClick={() => setVisibility(vis)}
                  className={[
                    'flex-1 rounded-xl py-2 px-3 text-xs font-semibold border transition-all',
                    visibility === vis
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/50'
                      : 'bg-surface-800 text-text-secondary border-surface-700 hover:text-white',
                  ].join(' ')}
                >
                  {vis === 'PRIVATE' ? '🔒 Private' : '🌐 Public'}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              {collectionToEdit ? 'Save Changes' : 'Create Collection'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

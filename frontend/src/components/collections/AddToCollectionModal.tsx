import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import type { Content } from '@/types';
import { collectionService } from '@/services/collection';
import { useCollections } from '@/hooks/useCollections';
import { ADD_TO_WATCHLIST, REMOVE_FROM_WATCHLIST } from '@/graphql/watchlist';
import { Badge, Button, Input } from '@/components/ui';

interface AddToCollectionModalProps {
  content: Content;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  content,
  isOpen,
  onClose,
}) => {
  const { collections, refresh } = useCollections();
  const [showCreateInline, setShowCreateInline] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const [addToWatchlistMutation] = useMutation(ADD_TO_WATCHLIST);
  const [removeFromWatchlistMutation] = useMutation(REMOVE_FROM_WATCHLIST);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleToggleCollection = async (collectionId: string) => {
    const isIn = collectionService.isContentInCollection(collectionId, content.id);

    if (isIn) {
      collectionService.removeContentFromCollection(collectionId, content.id);
      if (collectionId === 'col-watch-later') {
        await removeFromWatchlistMutation({ variables: { contentId: content.id } }).catch(() => {});
      }
      setFeedback(`Removed from collection.`);
    } else {
      collectionService.addContentToCollection(collectionId, content);
      if (collectionId === 'col-watch-later') {
        await addToWatchlistMutation({ variables: { contentId: content.id } }).catch(() => {});
      }
      setFeedback(`Added to collection.`);
    }
    refresh();

    setTimeout(() => setFeedback(null), 2500);
  };

  const handleCreateInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    const newCol = collectionService.createCollection({
      name: newColName.trim(),
      description: newColDesc.trim(),
    });

    collectionService.addContentToCollection(newCol.id, content);
    refresh();
    setNewColName('');
    setNewColDesc('');
    setShowCreateInline(false);
    setFeedback(`Created "${newCol.name}" and added content.`);
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-to-collection-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-card max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-surface-600 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-700/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 text-xl font-bold">
              📚
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Add to Collection</h3>
              <p className="text-xs text-text-muted mt-0.5">Organize in your personal workspaces</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Item Summary */}
        <div className="flex items-center gap-3 bg-surface-900/60 p-3 rounded-xl border border-surface-700/60">
          {content.posterUrl && (
            <img
              src={content.posterUrl}
              alt={content.title}
              className="h-14 w-10 object-cover rounded-lg shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate">{content.title}</h4>
            <p className="text-xs text-text-muted mt-0.5">
              {content.releaseYear} • {content.type} • {content.genres[0]?.name}
            </p>
          </div>
        </div>

        {feedback && (
          <div className="flex items-center justify-center p-2">
            <Badge variant="success" className="px-3 py-1 text-xs">
              {feedback}
            </Badge>
          </div>
        )}

        {/* Collections Checklist */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Your Collections
          </span>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {collections.map((col) => {
              const isIn = collectionService.isContentInCollection(col.id, content.id);
              return (
                <div
                  key={col.id}
                  onClick={() => handleToggleCollection(col.id)}
                  className={[
                    'flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all',
                    isIn
                      ? 'bg-brand-500/15 border-brand-500/40 text-white'
                      : 'bg-surface-900/50 border-surface-700/60 text-text-secondary hover:border-surface-600 hover:text-white',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{isIn ? '✅' : '📁'}</span>
                    <div>
                      <p className="text-xs font-bold">{col.name}</p>
                      <p className="text-[10px] text-text-muted">{col.contentCount} items</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-brand-300">
                    {isIn ? 'Remove' : '+ Add'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create New Collection Inline Trigger */}
        {!showCreateInline ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCreateInline(true)}
            className="w-full text-xs"
          >
            + Create New Collection
          </Button>
        ) : (
          <form onSubmit={handleCreateInline} className="space-y-3 bg-surface-900/80 p-4 rounded-xl border border-surface-700">
            <h5 className="text-xs font-bold text-white">New Collection Details</h5>
            <Input
              placeholder="Collection name (e.g. Classics)"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              required
            />
            <Input
              placeholder="Short description (optional)"
              value={newColDesc}
              onChange={(e) => setNewColDesc(e.target.value)}
            />
            <div className="flex gap-2 justify-end pt-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateInline(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Create & Add Title
              </Button>
            </div>
          </form>
        )}

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

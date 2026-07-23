import { useState, useEffect, useCallback } from 'react';
import { collectionService } from '@/services/collection';
import type { Collection, UpdateCollectionInput } from '@/services/collection';
import type { Content } from '@/types';

export const useCollection = (collectionId: string) => {
  const [collection, setCollection] = useState<Collection | undefined>(() =>
    collectionService.getCollectionById(collectionId)
  );

  const refresh = useCallback(() => {
    setCollection(collectionService.getCollectionById(collectionId));
  }, [collectionId]);

  useEffect(() => {
    const unsubscribe = collectionService.subscribe(refresh);
    refresh();
    return unsubscribe;
  }, [refresh]);

  const addContent = useCallback(
    (content: Content) => {
      return collectionService.addContentToCollection(collectionId, content);
    },
    [collectionId]
  );

  const removeContent = useCallback(
    (contentId: string) => {
      return collectionService.removeContentFromCollection(collectionId, contentId);
    },
    [collectionId]
  );

  const isContentInCollection = useCallback(
    (contentId: string) => {
      return collectionService.isContentInCollection(collectionId, contentId);
    },
    [collectionId]
  );

  const updateCollection = useCallback(
    (input: UpdateCollectionInput) => {
      return collectionService.updateCollection(collectionId, input);
    },
    [collectionId]
  );

  const deleteCollection = useCallback(() => {
    return collectionService.deleteCollection(collectionId);
  }, [collectionId]);

  return {
    collection,
    addContent,
    removeContent,
    isContentInCollection,
    updateCollection,
    deleteCollection,
    refresh,
  };
};

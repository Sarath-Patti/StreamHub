import { useState, useEffect, useCallback } from 'react';
import { collectionService } from '@/services/collection';
import type { Collection, CreateCollectionInput, UpdateCollectionInput } from '@/services/collection';

export const useCollections = (initialSearchQuery: string = '') => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [collections, setCollections] = useState<Collection[]>(() =>
    collectionService.getCollections(initialSearchQuery)
  );

  const refresh = useCallback(() => {
    setCollections(collectionService.getCollections(searchQuery));
  }, [searchQuery]);

  useEffect(() => {
    const unsubscribe = collectionService.subscribe(refresh);
    refresh();
    return unsubscribe;
  }, [refresh]);

  const createCollection = useCallback((input: CreateCollectionInput) => {
    return collectionService.createCollection(input);
  }, []);

  const updateCollection = useCallback((id: string, input: UpdateCollectionInput) => {
    return collectionService.updateCollection(id, input);
  }, []);

  const deleteCollection = useCallback((id: string) => {
    return collectionService.deleteCollection(id);
  }, []);

  return {
    collections,
    searchQuery,
    setSearchQuery,
    createCollection,
    updateCollection,
    deleteCollection,
    refresh,
  };
};

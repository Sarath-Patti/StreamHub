import type { Content } from '@/types';

export type CollectionVisibility = 'PUBLIC' | 'PRIVATE';

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  visibility: CollectionVisibility;
  contentCount: number;
  createdAt: string;
  updatedAt: string;
  items: Content[];
}

export interface CreateCollectionInput {
  name: string;
  description?: string;
  visibility?: CollectionVisibility;
  coverImage?: string;
}

export interface UpdateCollectionInput {
  name?: string;
  description?: string;
  visibility?: CollectionVisibility;
  coverImage?: string;
}

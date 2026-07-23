import type { Content } from '@/types';
import type { Collection, CreateCollectionInput, UpdateCollectionInput } from './types';

const STORAGE_KEY = 'streamhub_user_collections';

type Listener = () => void;

export class CollectionService {
  private collections: Collection[] = [];
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.collections = JSON.parse(data);
      } else {
        // Initialize default collections
        this.collections = [
          {
            id: 'col-favorites',
            name: 'Favorites',
            description: 'My top-tier movies and series of all time.',
            visibility: 'PUBLIC',
            contentCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            items: [],
          },
          {
            id: 'col-watch-later',
            name: 'Watch Later',
            description: 'Bookmarked titles queued for weekend streaming.',
            visibility: 'PRIVATE',
            contentCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            items: [],
          },
        ];
        this.saveToStorage();
      }
    } catch {
      this.collections = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.collections));
    } catch (e) {
      console.error('[CollectionService] Failed to save to localStorage:', e);
    }
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Fetches all collections, optionally filtered by search query name.
   */
  public getCollections(searchQuery?: string): Collection[] {
    if (!searchQuery || !searchQuery.trim()) {
      return [...this.collections];
    }
    const q = searchQuery.trim().toLowerCase();
    return this.collections.filter((col) => col.name.toLowerCase().includes(q));
  }

  /**
   * Fetches single collection by ID.
   */
  public getCollectionById(id: string): Collection | undefined {
    return this.collections.find((col) => col.id === id);
  }

  /**
   * Creates a new user collection.
   */
  public createCollection(input: CreateCollectionInput): Collection {
    const newCollection: Collection = {
      id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: input.name.trim(),
      description: input.description?.trim() || '',
      visibility: input.visibility || 'PRIVATE',
      coverImage: input.coverImage?.trim(),
      contentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
    };

    this.collections.unshift(newCollection);
    this.saveToStorage();
    return newCollection;
  }

  /**
   * Updates an existing collection (name, description, visibility, cover).
   */
  public updateCollection(id: string, input: UpdateCollectionInput): Collection | undefined {
    const index = this.collections.findIndex((col) => col.id === id);
    if (index === -1) return undefined;

    const existing = this.collections[index];
    const updated: Collection = {
      ...existing,
      name: input.name !== undefined ? input.name.trim() : existing.name,
      description: input.description !== undefined ? input.description.trim() : existing.description,
      visibility: input.visibility || existing.visibility,
      coverImage: input.coverImage !== undefined ? input.coverImage.trim() : existing.coverImage,
      updatedAt: new Date().toISOString(),
    };

    this.collections[index] = updated;
    this.saveToStorage();
    return updated;
  }

  /**
   * Deletes a collection by ID.
   */
  public deleteCollection(id: string): boolean {
    const initialLen = this.collections.length;
    this.collections = this.collections.filter((col) => col.id !== id);
    if (this.collections.length !== initialLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  /**
   * Adds content item to a collection.
   */
  public addContentToCollection(collectionId: string, content: Content): boolean {
    const collection = this.getCollectionById(collectionId);
    if (!collection) return false;

    // Check duplicate
    if (collection.items.some((item) => item.id === content.id)) {
      return false;
    }

    collection.items.unshift(content);
    collection.contentCount = collection.items.length;
    if (!collection.coverImage && content.posterUrl) {
      collection.coverImage = content.posterUrl;
    }
    collection.updatedAt = new Date().toISOString();

    this.saveToStorage();
    return true;
  }

  /**
   * Removes content item from a collection.
   */
  public removeContentFromCollection(collectionId: string, contentId: string): boolean {
    const collection = this.getCollectionById(collectionId);
    if (!collection) return false;

    const initialLen = collection.items.length;
    collection.items = collection.items.filter((item) => item.id !== contentId);
    if (collection.items.length !== initialLen) {
      collection.contentCount = collection.items.length;
      if (collection.items.length > 0) {
        collection.coverImage = collection.items[0].posterUrl;
      } else {
        collection.coverImage = undefined;
      }
      collection.updatedAt = new Date().toISOString();
      this.saveToStorage();
      return true;
    }
    return false;
  }

  /**
   * Checks if content exists inside a specific collection.
   */
  public isContentInCollection(collectionId: string, contentId: string): boolean {
    const collection = this.getCollectionById(collectionId);
    if (!collection) return false;
    return collection.items.some((item) => item.id === contentId);
  }

  /**
   * Syncs watchlist items into a collection.
   */
  public syncWatchlistItems(items: Content[]): void {
    const watchLater = this.getCollectionById('col-watch-later');
    if (watchLater) {
      items.forEach((item) => {
        if (!watchLater.items.some((i) => i.id === item.id)) {
          watchLater.items.push(item);
        }
      });
      watchLater.contentCount = watchLater.items.length;
      if (watchLater.items.length > 0 && !watchLater.coverImage) {
        watchLater.coverImage = watchLater.items[0].posterUrl;
      }
      this.saveToStorage();
    }
  }
}

export const collectionService = new CollectionService();

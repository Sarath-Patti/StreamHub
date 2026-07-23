import { describe, it, expect, beforeEach } from 'vitest';
import { CollectionService } from '../collection/collection.service';
import type { Content } from '@/types';

// Mock localStorage for node environment
const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: storageMock, writable: true });

const sampleContent: Content = {
  id: 'test-101',
  title: 'Blade Runner 2049',
  type: 'MOVIE',
  releaseYear: 2017,
  rating: 8.0,
  duration: 164,
  language: 'English',
  description: 'Cyberpunk neo-noir masterpiece.',
  genres: [{ id: 'sci-fi', name: 'Sci-Fi' }],
  isTrending: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

describe('CollectionService', () => {
  let service: CollectionService;

  beforeEach(() => {
    localStorage.clear();
    service = new CollectionService();
  });

  it('creates a new user collection', () => {
    const col = service.createCollection({ name: 'Cyberpunk Movies', description: 'Futuristic classics' });
    expect(col.name).toBe('Cyberpunk Movies');
    expect(col.contentCount).toBe(0);
    expect(service.getCollections().length).toBeGreaterThan(1);
  });

  it('adds and removes content items from a collection', () => {
    const col = service.createCollection({ name: 'Test Workspace' });
    const added = service.addContentToCollection(col.id, sampleContent);
    expect(added).toBe(true);
    expect(service.isContentInCollection(col.id, sampleContent.id)).toBe(true);

    const removed = service.removeContentFromCollection(col.id, sampleContent.id);
    expect(removed).toBe(true);
    expect(service.isContentInCollection(col.id, sampleContent.id)).toBe(false);
  });
});

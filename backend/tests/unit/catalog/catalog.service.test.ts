import { describe, it, expect, vi } from 'vitest';
import { CatalogService } from '@/modules/catalog/service/catalog.service';
import { CatalogRepository } from '@/modules/catalog/repository/catalog.repository';
import { NotFoundError } from '@/shared/errors';

describe('CatalogService Unit Tests', () => {
  const mockRepo = {
    findById: vi.fn(),
    findAll: vi.fn(),
    search: vi.fn(),
    findTrending: vi.fn(),
    findAllGenres: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  } as unknown as CatalogRepository;

  const catalogService = new CatalogService(mockRepo);

  it('getContentById throws NotFoundError for invalid content ID', async () => {
    vi.spyOn(mockRepo, 'findById').mockResolvedValueOnce(null);

    await expect(catalogService.getContentById('invalid-id')).rejects.toThrow(NotFoundError);
  });

  it('getContentById returns formatted content DTO', async () => {
    const mockContent = {
      id: 'movie-1',
      title: 'Inception',
      description: 'A mind-bending thriller',
      type: 'MOVIE' as const,
      releaseYear: 2010,
      duration: 148,
      language: 'English',
      rating: 8.8,
      posterUrl: null,
      bannerUrl: null,
      isTrending: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      genres: [{ id: 'genre-1', name: 'Sci-Fi', createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') }],
    };

    vi.spyOn(mockRepo, 'findById').mockResolvedValueOnce(mockContent as any);

    const result = await catalogService.getContentById('movie-1');
    expect(result.id).toBe('movie-1');
    expect(result.title).toBe('Inception');
    expect(result.type).toBe('MOVIE');
    expect(result.genres).toHaveLength(1);
    expect(result.genres[0].name).toBe('Sci-Fi');
  });

  it('getContents handles pagination calculations correctly', async () => {
    vi.spyOn(mockRepo, 'findAll').mockResolvedValueOnce({
      items: [],
      total: 45,
    });

    const result = await catalogService.getContents({ page: 2, limit: 10 });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.total).toBe(45);
    expect(result.totalPages).toBe(5);
  });
});

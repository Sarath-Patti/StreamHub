import type { Content } from '@/types';
import type { SearchFilterState } from './types';

export class SearchFilterEngine {
  /**
   * Filters a list of content candidates against multi-criteria SearchFilterState simultaneously.
   */
  public static filterContent(candidates: Content[], filters: SearchFilterState): Content[] {
    const q = filters.query.trim().toLowerCase();

    return candidates.filter((item) => {
      // 1. Text Query Filter (Title, Description, Genres, Language)
      if (q) {
        const titleMatch = item.title.toLowerCase().includes(q);
        const descMatch = item.description.toLowerCase().includes(q);
        const genreMatch = item.genres.some((g) => g.name.toLowerCase().includes(q));
        const langMatch = item.language.toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !genreMatch && !langMatch) {
          return false;
        }
      }

      // 2. Genre Filter (All or any selected genres)
      if (filters.genreIds.length > 0) {
        const itemGenreIds = new Set(item.genres.map((g) => g.id.toLowerCase()));
        const hasMatch = filters.genreIds.some((gid) => itemGenreIds.has(gid.toLowerCase()));
        if (!hasMatch) return false;
      }

      // 3. Content Type Filter (MOVIE vs SERIES)
      if (filters.contentType && item.type !== filters.contentType) {
        return false;
      }

      // 4. Minimum Rating Filter
      if (filters.minRating > 0) {
        const rating = item.rating ?? 0;
        if (rating < filters.minRating) return false;
      }

      // 5. Release Year Range Filter
      if (filters.startYear && item.releaseYear < filters.startYear) {
        return false;
      }
      if (filters.endYear && item.releaseYear > filters.endYear) {
        return false;
      }

      // 6. Language Filter
      if (filters.language && item.language.toLowerCase() !== filters.language.toLowerCase()) {
        return false;
      }

      // 7. Runtime Duration Filter
      if (item.duration) {
        if (filters.minDuration && item.duration < filters.minDuration) return false;
        if (filters.maxDuration && item.duration > filters.maxDuration) return false;
      }

      return true;
    });
  }
}

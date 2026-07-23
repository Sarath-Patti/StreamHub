import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import type { Content } from '@/types';
import { GET_CONTENT_BY_ID, GET_SIMILAR_CONTENT } from '@/graphql/content';
import { recommendationService } from '@/services/recommendation';
import { WhyYoullLikeThis } from '@/components/intelligence/WhyYoullLikeThis';
import { RecommendedNext } from '@/components/intelligence/RecommendedNext';
import { AddToCollectionModal } from '@/components/collections/AddToCollectionModal';
import { ErrorState } from '@/components/discover/ErrorState';
import { Badge, Button, Spinner } from '@/components/ui';

export const ContentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('hybrid');
  const [isAddToCollectionOpen, setIsAddToCollectionOpen] = useState(false);

  // Fetch target content details
  const {
    data: contentData,
    loading: contentLoading,
    error: contentError,
    refetch: refetchContent,
  } = useQuery<{ content: Content }>(GET_CONTENT_BY_ID, {
    variables: { id: id ?? '' },
    skip: !id,
  });

  // Fetch candidate similar items
  const {
    data: similarData,
    loading: similarLoading,
  } = useQuery<{ similarContent: { items: Content[] } }>(GET_SIMILAR_CONTENT, {
    variables: { contentId: id ?? '', limit: 12 },
    skip: !id,
  });

  const content = contentData?.content;

  // Deterministically compute match score & explanations for target content using active strategy
  const targetMatchResult = useMemo(() => {
    if (!content) return null;
    return recommendationService.computeRecommendationScore(content, undefined, selectedStrategyId);
  }, [content, selectedStrategyId]);

  // Deterministically rank candidate similar content using active strategy (Strategy Pattern)
  const rankedRecommendedNext = useMemo(() => {
    const candidates = similarData?.similarContent?.items || [];
    if (!content || candidates.length === 0) return [];
    return recommendationService.rankSimilarContent(content, candidates, selectedStrategyId);
  }, [content, similarData, selectedStrategyId]);

  if (contentLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (contentError || !content) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <ErrorState
          message={contentError?.message || 'Content title not found.'}
          onRetry={() => refetchContent()}
        />
      </div>
    );
  }

  const formattedRating = content.rating ? content.rating.toFixed(1) : null;
  const isMovie = content.type === 'MOVIE';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-text-muted">
        <Link to="/discover" className="hover:text-white transition-colors">
          Discover
        </Link>
        <span>/</span>
        <span className="text-text-secondary truncate max-w-[200px] sm:max-w-none">
          {content.title}
        </span>
      </nav>

      {/* Hero Header & Rich Metadata */}
      <section className="relative overflow-hidden rounded-3xl bg-surface-800 border border-surface-700/60 p-6 sm:p-10 shadow-2xl">
        {/* Banner background with gradient overlay */}
        {content.bannerUrl && (
          <div className="absolute inset-0 z-0 opacity-20 overflow-hidden">
            <img
              src={content.bannerUrl}
              alt=""
              className="h-full w-full object-cover blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-800 via-surface-800/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Image */}
          <div className="shrink-0 w-44 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-surface-700/80 bg-surface-900">
            {content.posterUrl ? (
              <img
                src={content.posterUrl}
                alt={content.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center gradient-brand p-4 text-center">
                <span className="text-4xl font-extrabold text-white">
                  {content.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="flex-1 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={isMovie ? 'brand' : 'accent'}
                className="px-3 py-1 text-xs uppercase font-bold tracking-wider"
              >
                {content.type}
              </Badge>

              {formattedRating && (
                <Badge variant="warning" className="px-3 py-1 text-xs font-bold flex items-center gap-1">
                  <span className="text-yellow-400">★</span> {formattedRating} / 10
                </Badge>
              )}

              <Badge variant="neutral" className="px-3 py-1 text-xs">
                {content.releaseYear}
              </Badge>

              {content.duration && (
                <Badge variant="neutral" className="px-3 py-1 text-xs">
                  {content.duration} minutes
                </Badge>
              )}

              <Badge variant="neutral" className="px-3 py-1 text-xs uppercase">
                {content.language}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {content.title}
            </h1>

            {/* Genre badges */}
            <div className="flex flex-wrap gap-2">
              {content.genres.map((g) => (
                <span
                  key={g.id}
                  className="rounded-full bg-surface-700/90 border border-surface-600/60 px-3.5 py-1 text-xs font-semibold text-text-secondary"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl">
              {content.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button variant="primary" size="lg" onClick={() => alert(`Starting stream playback for "${content.title}"...`)}>
                ▶ Play Title
              </Button>
              <Button variant="secondary" size="lg" onClick={() => setIsAddToCollectionOpen(true)}>
                📚 + Add to Collection
              </Button>
              <Link to="/discover">
                <Button variant="ghost" size="lg">
                  ← Back to Discover
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Intelligence Panel */}
      {targetMatchResult && (
        <section>
          <WhyYoullLikeThis matchResult={targetMatchResult} />
        </section>
      )}

      {/* Recommended Next Section with Strategy Selector */}
      <section>
        <RecommendedNext
          targetContent={content}
          rankedItems={rankedRecommendedNext}
          selectedStrategyId={selectedStrategyId}
          onStrategyChange={setSelectedStrategyId}
          loading={similarLoading}
        />
      </section>

      {/* Add To Collection Modal */}
      {content && (
        <AddToCollectionModal
          content={content}
          isOpen={isAddToCollectionOpen}
          onClose={() => setIsAddToCollectionOpen(false)}
        />
      )}
    </div>
  );
};

export default ContentDetails;

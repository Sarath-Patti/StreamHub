import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '@/services/analytics';
import type { DashboardSummary } from '@/services/analytics';

export const useAnalytics = () => {
  const [summary, setSummary] = useState<DashboardSummary>(() =>
    analyticsService.getDashboardSummary()
  );

  const refresh = useCallback(() => {
    setSummary(analyticsService.getDashboardSummary());
  }, []);

  useEffect(() => {
    const unsubscribe = analyticsService.subscribe(refresh);
    refresh();
    return unsubscribe;
  }, [refresh]);

  const trackEvent = useCallback((type: Parameters<typeof analyticsService.trackEvent>[0], details: string) => {
    analyticsService.trackEvent(type, details);
  }, []);

  return {
    summary,
    trackEvent,
    refresh,
  };
};

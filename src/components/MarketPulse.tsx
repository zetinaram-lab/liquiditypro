// ============================================
// Updated Market Pulse with Translation Support + Thermal Optimization
// v1.0.3 - Added React.memo to prevent unnecessary re-renders
// ============================================

import { useState, useMemo, memo } from 'react';
import type { NewsItem, NewsFilterType } from '@/types/trading';
import { formatDistanceToNow } from 'date-fns';
import { Newspaper, BarChart3, Layers, Filter, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MarketPulseProps {
  news: NewsItem[];
}

// THERMAL OPTIMIZATION: Memoize entire component to prevent re-renders when news hasn't changed
export const MarketPulse = memo(({ news }: MarketPulseProps) => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<NewsFilterType>('all');
  const [translatedItems, setTranslatedItems] = useState<Set<string>>(new Set());

  // THERMAL OPTIMIZATION: Memoize filtered results
  const filteredNews = useMemo(() => {
    if (activeFilter === 'all') return news;
    return news.filter((item) => item.type === activeFilter);
  }, [news, activeFilter]);

  const filters: { id: NewsFilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: t.marketPulse.all, icon: <Filter className="w-3.5 h-3.5" /> },
    { id: 'news', label: t.marketPulse.news, icon: <Newspaper className="w-3.5 h-3.5" /> },
    { id: 'technical', label: t.marketPulse.technical, icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'orderblock', label: t.marketPulse.obHits, icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  const toggleTranslation = (id: string) => {
    setTranslatedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getImpactDot = (impact: NewsItem['impact']) => {
    const classes = {
      high: 'impact-dot impact-high',
      medium: 'impact-dot impact-medium',
      low: 'impact-dot impact-low',
    };
    return <span className={classes[impact]} />;
  };

  const getTypeIcon = (type: NewsItem['type']) => {
    switch (type) {
      case 'news':
        return <Newspaper className="w-3.5 h-3.5 text-accent" />;
      case 'technical':
        return <BarChart3 className="w-3.5 h-3.5 text-amber-400" />;
      case 'orderblock':
        return <Layers className="w-3.5 h-3.5 text-primary" />;
    }
  };

  return (
    <div className="trading-card h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground mb-3">{t.marketPulse.title}</h2>

        {/* Filter Tabs */}
        <div className="flex gap-1 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeFilter === filter.id
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar scrollbar-thin">
        {filteredNews.map((item, index) => {
          const isTranslated = translatedItems.has(item.id);
          const displaySummary = isTranslated && item.summaryEs ? item.summaryEs : item.summary;

          return (
            <article
              key={item.id}
              className="news-item p-4 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(item.type)}
                  <span className="text-xs font-medium text-foreground">{item.source}</span>
                  {getImpactDot(item.impact)}
                </div>
                <time className="text-xs text-muted-foreground">
                  {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                </time>
              </div>

              {/* Title */}
              <h3 className="text-sm font-medium text-foreground mb-1.5 leading-tight">
                {item.title}
              </h3>

              {/* Summary */}
              <p className="text-xs text-muted-foreground leading-relaxed">{displaySummary}</p>

              {/* Footer with Impact & Translate */}
              <div className="mt-2 flex items-center justify-between">
                <span
                  className={`text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded ${
                    item.impact === 'high'
                      ? 'bg-bearish/10 text-bearish'
                      : item.impact === 'medium'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-bullish/10 text-bullish'
                  }`}
                >
                  {item.impact} {t.marketPulse.impact}
                </span>

                {/* Translate Button */}
                {item.summaryEs && (
                  <button
                    onClick={() => toggleTranslation(item.id)}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      isTranslated
                        ? 'bg-accent/20 text-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <Languages className="w-3 h-3" />
                    {isTranslated
                      ? t.marketPulse.translateToEnglish
                      : t.marketPulse.translateToSpanish}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">
          {filteredNews.length} {t.marketPulse.items} • {t.marketPulse.autoRefreshing}
        </p>
      </div>
    </div>
  );
});

// Display name for debugging
MarketPulse.displayName = 'MarketPulse';

import { useState, useMemo } from 'react';
import { NewsItem } from '@/hooks/useMarketData';
import { formatDistanceToNow } from 'date-fns';
import { Newspaper, BarChart3, Layers, Filter } from 'lucide-react';

interface MarketPulseProps {
  news: NewsItem[];
}

type FilterType = 'all' | 'news' | 'technical' | 'orderblock';

export const MarketPulse = ({ news }: MarketPulseProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredNews = useMemo(() => {
    if (activeFilter === 'all') return news;
    return news.filter(item => item.type === activeFilter);
  }, [news, activeFilter]);

  const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <Filter className="w-3.5 h-3.5" /> },
    { id: 'news', label: 'News', icon: <Newspaper className="w-3.5 h-3.5" /> },
    { id: 'technical', label: 'Technical', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'orderblock', label: 'OB Hits', icon: <Layers className="w-3.5 h-3.5" /> },
  ];

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
        <h2 className="text-sm font-semibold text-foreground mb-3">Market Pulse</h2>
        
        {/* Filter Tabs */}
        <div className="flex gap-1">
          {filters.map(filter => (
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
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredNews.map((item, index) => (
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
            <p className="text-xs text-muted-foreground leading-relaxed">
              {item.summary}
            </p>

            {/* Impact Label */}
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded ${
                item.impact === 'high' 
                  ? 'bg-bearish/10 text-bearish' 
                  : item.impact === 'medium'
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-bullish/10 text-bullish'
              }`}>
                {item.impact} impact
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">
          {filteredNews.length} items • Auto-refreshing
        </p>
      </div>
    </div>
  );
};

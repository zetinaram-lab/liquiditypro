// ============================================
// Economic Calendar - High Impact Events
// ============================================

import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import type { EconomicEvent } from '@/types/trading';
import { useLanguage } from '@/contexts/LanguageContext';

interface EconomicCalendarProps {
  events: EconomicEvent[];
}

export const EconomicCalendar = ({ events }: EconomicCalendarProps) => {
  const { t } = useLanguage();
  const [countdown, setCountdown] = useState<string>('');

  // Find the nearest upcoming event
  const nextEvent = events.reduce((nearest, event) => {
    const now = new Date();
    if (event.date > now && (!nearest || event.date < nearest.date)) {
      return event;
    }
    return nearest;
  }, null as EconomicEvent | null);

  // Countdown timer effect
  useEffect(() => {
    if (!nextEvent) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = nextEvent.date.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown('NOW');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setCountdown(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdown(`${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextEvent]);

  const formatEventDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatEventTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="trading-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
            {t.economicCalendar.title}
          </span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-bearish/10 text-bearish font-medium uppercase">
          {t.economicCalendar.highImpact}
        </span>
      </div>

      {/* Countdown for Next Event */}
      {nextEvent && (
        <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-bearish/10 to-transparent border border-bearish/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-bearish" />
                <span className="text-[10px] uppercase text-muted-foreground">
                  {t.economicCalendar.nextEvent}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">{nextEvent.name}</span>
            </div>
            <div className="text-right">
              <div className="font-mono text-lg font-bold text-bearish glow-text-bearish">
                {countdown}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-2">
        {events.slice(0, 3).map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between p-2.5 rounded bg-secondary/30 border border-border/30"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-accent">{event.currency}</span>
                <span className="text-xs font-medium text-foreground truncate">
                  {event.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{formatEventDate(event.date)}</span>
                <span>•</span>
                <span>{formatEventTime(event.date)}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-0.5 ml-2">
              {event.previous && (
                <div className="text-[10px]">
                  <span className="text-muted-foreground">{t.economicCalendar.previous}: </span>
                  <span className="font-mono text-foreground">{event.previous}</span>
                </div>
              )}
              {event.forecast && (
                <div className="text-[10px]">
                  <span className="text-muted-foreground">{t.economicCalendar.forecast}: </span>
                  <span className="font-mono text-accent">{event.forecast}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

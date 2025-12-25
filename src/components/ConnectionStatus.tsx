// ============================================
// Connection Status Component
// ============================================

import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
  onReconnect: () => void;
}

export const ConnectionStatus = ({ isConnected, error, onReconnect }: ConnectionStatusProps) => {
  const { t } = useLanguage();

  if (isConnected && !error) {
    return (
      <div className="flex items-center gap-2 text-xs text-bullish">
        <Wifi className="w-4 h-4" />
        <span>{t.header.live}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-2 text-bearish">
        <WifiOff className="w-4 h-4" />
        <span>{error || 'Desconectado'}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onReconnect}
        className="h-6 px-2 text-xs"
      >
        <RefreshCw className="w-3 h-3 mr-1" />
        Reconectar
      </Button>
    </div>
  );
};

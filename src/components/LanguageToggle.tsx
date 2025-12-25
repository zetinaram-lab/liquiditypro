// ============================================
// Language Toggle Component
// ============================================

import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 border-border/50 text-foreground hover:bg-secondary relative z-20"
      aria-label={`Cambiar idioma a ${language === 'en' ? 'español' : 'inglés'}`}
    >
      <Globe className="w-4 h-4" />
      <span className="font-mono text-xs font-semibold">{language.toUpperCase()}</span>
    </Button>
  );
};

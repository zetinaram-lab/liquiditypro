// ============================================
// Footer Component - Minimal & Professional
// v1.0.8 - Updated with contributors
// ============================================

import { Github, Linkedin, Mail, Code2, Construction } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const texts = {
    en: {
      builtBy: 'Built by',
      status: 'In Development',
      version: 'Version',
      project: 'Demo Project - Not for Real Trading',
      contribute: 'View on GitHub',
      madeWith: 'Made with',
    },
    es: {
      builtBy: 'Desarrollado por',
      status: 'En Desarrollo',
      version: 'Versión',
      project: 'Proyecto Demo - No para Trading Real',
      contribute: 'Ver en GitHub',
      madeWith: 'Hecho con',
    },
  };

  const t = texts[language];

  return (
    <footer className="border-t border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Project Info & Contributors */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-sm font-bold text-background">LP</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{t.builtBy}</span>
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <span className="hover:text-primary transition-colors cursor-default">Ramses Zetina</span>
                  <span className="text-muted-foreground/60 text-xs">&</span>
                  <span className="hover:text-primary transition-colors cursor-default">Oliver Urik</span>
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-border/50" />

            <div className="flex items-center gap-2">
              <Construction className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">{t.status}</span>
            </div>

            <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
              <Code2 className="w-3 h-3" />
              <span>{t.version} 1.0.8</span>
            </div>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/zetinaram-lab/liquiditypro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">{t.contribute}</span>
            </a>

            <a
              href="https://linkedin.com/in/huguette-mont"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            <a
              href="mailto:contact@liquiditypro.dev"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom: Copyright & Disclaimer */}
        <div className="mt-4 pt-4 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {currentYear} LiquidityPro. {t.project}.</p>
          <p className="flex items-center gap-1">
            {t.madeWith} <span className="text-red-500">♥</span> {t.forTraders}
          </p>
        </div>
      </div>
    </footer>
  );
};

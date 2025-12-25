// ============================================
// Risk Calculator Drawer - Position Sizer
// ============================================

import { useState, useMemo } from 'react';
import { Calculator, DollarSign, Percent, Target, TrendingDown } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculatePositionSize } from '@/data/marketStore';
import { useLanguage } from '@/contexts/LanguageContext';

export const RiskCalculator = () => {
  const { t } = useLanguage();
  const [accountBalance, setAccountBalance] = useState<string>('10000');
  const [riskPercent, setRiskPercent] = useState<string>('1');
  const [stopLossPips, setStopLossPips] = useState<string>('50');
  const [isOpen, setIsOpen] = useState(false);

  const result = useMemo(() => {
    const balance = parseFloat(accountBalance) || 0;
    const risk = parseFloat(riskPercent) || 0;
    const stopLoss = parseFloat(stopLossPips) || 0;

    if (balance > 0 && risk > 0 && stopLoss > 0) {
      return calculatePositionSize(balance, risk, stopLoss);
    }
    return null;
  }, [accountBalance, riskPercent, stopLossPips]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-accent/30 text-accent hover:bg-accent/10 hover:text-accent relative z-10 min-w-fit whitespace-nowrap"
          aria-label={t.riskCalculator.positionSizer}
        >
          <Calculator className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline text-xs truncate max-w-[120px]">
            {t.riskCalculator.positionSizer}
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[400px] bg-background border-border z-50">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Calculator className="w-5 h-5 text-accent" />
            {t.riskCalculator.title}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Account Balance */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5" />
              {t.riskCalculator.accountBalance}
            </Label>
            <Input
              type="number"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
              className="font-mono bg-secondary border-border text-foreground"
              placeholder="10000"
            />
          </div>

          {/* Risk Percent */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-2">
              <Percent className="w-3.5 h-3.5" />
              {t.riskCalculator.riskPercent}
            </Label>
            <Input
              type="number"
              value={riskPercent}
              onChange={(e) => setRiskPercent(e.target.value)}
              className="font-mono bg-secondary border-border text-foreground"
              placeholder="1"
              step="0.1"
              min="0.1"
              max="10"
            />
          </div>

          {/* Stop Loss Pips */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-3.5 h-3.5" />
              {t.riskCalculator.stopLossPips}
            </Label>
            <Input
              type="number"
              value={stopLossPips}
              onChange={(e) => setStopLossPips(e.target.value)}
              className="font-mono bg-secondary border-border text-foreground"
              placeholder="50"
            />
          </div>

          {/* Results */}
          {result && (
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {t.riskCalculator.result}
                </span>
              </div>

              {/* Lot Size */}
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10 border border-primary/30">
                <span className="text-xs text-muted-foreground">{t.riskCalculator.lotSize}</span>
                <span className="font-mono text-lg font-bold text-primary glow-text-bullish">
                  {result.lotSize.toFixed(2)}
                </span>
              </div>

              {/* Risk Amount */}
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border/50">
                <span className="text-xs text-muted-foreground">{t.riskCalculator.riskAmount}</span>
                <span className="font-mono text-sm text-foreground">${result.riskAmount.toFixed(2)}</span>
              </div>

              {/* Pip Value */}
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border/50">
                <span className="text-xs text-muted-foreground">{t.riskCalculator.pipValue}</span>
                <span className="font-mono text-sm text-foreground">${result.pipValue.toFixed(2)}/pip</span>
              </div>

              {/* Info Note */}
              <p className="text-[10px] text-muted-foreground text-center pt-2">
                XAU/USD • Standard Lot = 100 oz
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

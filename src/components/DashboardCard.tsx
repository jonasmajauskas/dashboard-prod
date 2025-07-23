import React from 'react';

// Market displays// Highs displays
import { StockHighs } from './categories/newHighs/StockHighs';
import { Gains24H } from './categories/newHighs/Gains24H';
import { Gains7D } from './categories/newHighs/Gains7D';
import { Gains30D } from './categories/newHighs/Gains30D';
// Economic displays
import { EconomicIndicators } from './categories/economicIndicators/EconomicIndicators';
import { GlobalEconomics } from './categories/economicIndicators/GlobalEconomics';
import { CryptoPrices } from './categories/economicIndicators/CryptoPrices';
import { MarketIndices } from './categories/economicIndicators/MarketIndices';
// Portfolio displays
import { IncomePortfolio } from './displays/portfolio/IncomePortfolio';
import { GrowthPortfolio } from './displays/portfolio/GrowthPortfolio';
// Averages displays
import { Average24H } from './categories/newHighs/averages/Average24H';
import { Average7D } from './categories/newHighs/averages/Average7D';
import { Average30D } from './categories/newHighs/averages/Average30D';
export interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  data?: any; // optional, or remove entirely if not used
  type:
    | 'market-metrics'
    | 'economic-indicators'
    | 'market-indices'
    | 'global-economics'
    | 'income-portfolio'
    | 'growth-portfolio'
    | 'crypto-prices'
    | 'stock-highs'
    | 'day-gain-loss'
    | 'week-gain-loss'
    | 'month-gain-loss'
    | 'average-gain-loss-24h'
    | 'average-gain-loss-7d'
    | 'average-gain-loss-30d';
}
export function DashboardCard({
  title,
  icon,
  type
}: DashboardCardProps) {
  return <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-card-foreground">{title}</h3>
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </div>
      <div className="p-4">
        {type === 'global-economics' && <GlobalEconomics />}
        {type === 'market-indices' && <MarketIndices />}
        {type === 'income-portfolio' && <IncomePortfolio />}
        {type === 'growth-portfolio' && <GrowthPortfolio />}
        {type === 'economic-indicators' && <EconomicIndicators />}
        {type === 'crypto-prices' && <CryptoPrices />}
        {type === 'stock-highs' && <StockHighs />}
        {type === 'day-gain-loss' && <Gains24H />}
        {type === 'week-gain-loss' && <Gains7D />}
        {type === 'month-gain-loss' && <Gains30D />}
        {type === 'average-gain-loss-24h' && <Average24H />}
        {type === 'average-gain-loss-7d' && <Average7D />}
        {type === 'average-gain-loss-30d' && <Average30D />}
      </div>
    </div>;
}
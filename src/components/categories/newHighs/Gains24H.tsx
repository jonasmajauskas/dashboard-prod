import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { useHighs } from '@/context/HighsContext';

export function Gains24H() {
  const navigate = useNavigate();
  const { dashboardData } = useHighs();

  const percentage = dashboardData?.past24Hpercentage ?? 0;
  const past24H = dashboardData?.past24H || [];
  const todayshighs = dashboardData?.todayshighs || [];

  // ✅ Gainers = in both past24H and todayshighs by symbol
  const gainers = todayshighs.filter((today: { symbol: any; }) =>
    past24H.some((past: { symbol: any; }) => past.symbol === today.symbol)
  );

  const trackedCount = gainers.length;

  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => navigate('/all-new-highs')}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`text-3xl font-semibold ${percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {percentage >= 0 ? '+' : ''}
              {percentage}%
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              {trackedCount} stocks tracked
            </span>
          </div>
          {percentage >= 0
            ? <TrendingUp className="h-8 w-8 text-green-500" />
            : <TrendingDown className="h-8 w-8 text-red-500" />}
        </div>
      </div>
      <button
        className="w-full flex items-center justify-center text-sm text-muted-foreground cursor-pointer"
        onClick={() => navigate('/past24h')}
      >
        <span>Show all stocks</span>
        <ChevronRight className="h-4 w-4 ml-1 transition-transform hover:translate-x-0.5" />
      </button>
    </div>
  );
}
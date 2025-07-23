import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { useHighs } from '@/context/HighsContext';

export function Gains30D() {
  const navigate = useNavigate();
  const { dashboardData } = useHighs();

  const trackedStocks = dashboardData?.past30D?.length || 0;
  const percentage = dashboardData?.past30Dpercentage ?? 0;
  const isPositive = percentage >= 0;

  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => navigate('/all-new-highs')}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`text-3xl font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}
              {percentage}%
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              {trackedStocks} stocks tracked
            </span>
          </div>
          {isPositive ? (
            <TrendingUp className="h-8 w-8 text-green-500" />
          ) : (
            <TrendingDown className="h-8 w-8 text-red-500" />
          )}
        </div>
      </div>
      <button
        className="w-full flex items-center justify-center text-sm text-muted-foreground cursor-pointer"
        onClick={() => navigate('/past30d')}
      >
        <span>Show all stocks</span>
        <ChevronRight className="h-4 w-4 ml-1 transition-transform hover:translate-x-0.5" />
      </button>
    </div>
  );
}

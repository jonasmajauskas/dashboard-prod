import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useHighs } from '@/context/HighsContext';

export function Average24H() {
  const { dashboardData } = useHighs();
  const averageChange = dashboardData?.average24H ?? 0;
  const totalStocks = dashboardData?.average24HCount ?? 0;

  const isPositive = averageChange >= 0;

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`text-3xl font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}
              {averageChange.toFixed(0)}%
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              {totalStocks.toLocaleString()} stocks tracked
            </span>
          </div>
          {isPositive
            ? <TrendingUp className="h-8 w-8 text-green-500" />
            : <TrendingDown className="h-8 w-8 text-red-500" />}
        </div>
      </div>
    </div>
  );
}

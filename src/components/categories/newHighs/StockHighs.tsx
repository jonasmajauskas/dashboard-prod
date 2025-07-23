import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { useHighs } from '@/context/HighsContext';

export function StockHighs() {
  const navigate = useNavigate();
  const { dashboardData } = useHighs();

  // ✅ Access the correct array from dashboardData
  const highsToday = dashboardData?.todayshighs || [];
  // console.log('stockhigh display highsToday', highsToday)

  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => navigate('/stock-analysis')}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-3xl font-semibold text-green-500">
              {highsToday.length}
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              New Highs Today
            </span>
          </div>
          <TrendingUp className="h-8 w-8 text-green-500" />
        </div>
      </div>
      <button
        className="w-full flex items-center justify-center text-sm text-muted-foreground cursor-pointer"
        onClick={() => navigate('/all-new-highs')}
      >
        <span>Show all stocks</span>
        <ChevronRight className="h-4 w-4 ml-1 transition-transform hover:translate-x-0.5" />
      </button>
    </div>
  );
}
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface PerformanceData {
  totalGainLoss: number;
  winRate: number;
  totalCommitted: number;
  profitability: number;
}
interface OpenPosition {
  symbol: string;
  name: string;
  purchaseDate: string;
  purchasePrice: number;
  currentPrice: number;
  shares: number;
}
interface PastPosition {
  symbol: string;
  name: string;
  purchaseDate: string;
  sellDate: string;
  purchasePrice: number;
  sellPrice: number;
  shares: number;
}
const performanceData: PerformanceData = {
  totalGainLoss: 142650,
  winRate: 68.5,
  totalCommitted: 850000,
  profitability: 16.8
};
const openPositions: OpenPosition[] = [{
  symbol: 'AAPL',
  name: 'Apple Inc.',
  purchaseDate: '2023-09-15',
  purchasePrice: 175.24,
  currentPrice: 198.11,
  shares: 100
}, {
  symbol: 'MSFT',
  name: 'Microsoft Corporation',
  purchaseDate: '2023-10-01',
  purchasePrice: 312.45,
  currentPrice: 374.58,
  shares: 50
}, {
  symbol: 'GOOGL',
  name: 'Alphabet Inc.',
  purchaseDate: '2023-11-05',
  purchasePrice: 132.18,
  currentPrice: 142.65,
  shares: 75
}, {
  symbol: 'META',
  name: 'Meta Platforms Inc.',
  purchaseDate: '2023-08-20',
  purchasePrice: 292.87,
  currentPrice: 334.92,
  shares: 60
}];
const pastPositions: PastPosition[] = [{
  symbol: 'NVDA',
  name: 'NVIDIA Corporation',
  purchaseDate: '2023-06-15',
  sellDate: '2023-12-01',
  purchasePrice: 285.45,
  sellPrice: 467.65,
  shares: 80
}, {
  symbol: 'AMZN',
  name: 'Amazon.com Inc.',
  purchaseDate: '2023-07-20',
  sellDate: '2023-11-15',
  purchasePrice: 122.75,
  sellPrice: 142.85,
  shares: 150
}, {
  symbol: 'TSLA',
  name: 'Tesla Inc.',
  purchaseDate: '2023-05-10',
  sellDate: '2023-10-25',
  purchasePrice: 172.82,
  sellPrice: 201.45,
  shares: 120
}, {
  symbol: 'JPM',
  name: 'JPMorgan Chase & Co.',
  purchaseDate: '2023-04-01',
  sellDate: '2023-09-30',
  purchasePrice: 127.89,
  sellPrice: 145.3,
  shares: 200
}];
export function PerformanceMetrics() {
  const navigate = useNavigate();
  const [isPositionsExpanded, setIsPositionsExpanded] = useState(false);
  const [isPastPositionsExpanded, setIsPastPositionsExpanded] = useState(false);
  const handlePositionClick = (position: OpenPosition) => {
    navigate('/trade', {
      state: {
        stock: {
          symbol: position.symbol,
          name: position.name,
          currentPrice: position.currentPrice
        },
        defaultValues: {
          type: 'sell',
          quantity: position.shares
        }
      }
    });
  };
  const roi = performanceData.totalGainLoss / performanceData.totalCommitted * 100;
  // Calculate total gain/loss for open positions
  const totalOpenPositionsValue = openPositions.reduce((total, position) => {
    const positionGainLoss = (position.currentPrice - position.purchasePrice) * position.shares;
    return total + positionGainLoss;
  }, 0);
  // Calculate total past positions P/L
  const totalPastPositionsValue = pastPositions.reduce((total, position) => {
    const positionGainLoss = (position.sellPrice - position.purchasePrice) * position.shares;
    return total + positionGainLoss;
  }, 0);
  return <div className="space-y-4">
      {/* Open Positions Section */}
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/open-positions')}>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Open Positions P/L
              </span>
              <span className={`text-2xl font-semibold ${totalOpenPositionsValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${Math.abs(totalOpenPositionsValue).toLocaleString()}
              </span>
            </div>
            {totalOpenPositionsValue >= 0 ? <TrendingUp className="h-6 w-6 text-green-500" /> : <TrendingDown className="h-6 w-6 text-red-500" />}
          </div>
        </div>
        <button className="w-full flex items-center justify-center text-sm text-muted-foreground cursor-pointer" onClick={() => navigate('/open-positions')}>
          <span>View all positions</span>
          <ChevronRight className="h-4 w-4 ml-1 transition-transform hover:translate-x-0.5" />
        </button>
      </div>
      {/* Past Positions Section */}
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Past Positions P/L
              </span>
              <span className={`text-2xl font-semibold ${totalPastPositionsValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${Math.abs(totalPastPositionsValue).toLocaleString()}
              </span>
            </div>
            {totalPastPositionsValue >= 0 ? <TrendingUp className="h-6 w-6 text-green-500" /> : <TrendingDown className="h-6 w-6 text-red-500" />}
          </div>
        </div>
        <button className="w-full flex items-center justify-center text-sm text-muted-foreground cursor-pointer" onClick={() => navigate('/past-positions')}>
          <span>View all past positions</span>
          <ChevronRight className="h-4 w-4 ml-1 transition-transform hover:translate-x-0.5" />
        </button>
        {isPastPositionsExpanded && <div className="space-y-3">
            {pastPositions.map(position => {
          const gainLoss = (position.sellPrice - position.purchasePrice) * position.shares;
          const percentageChange = (position.sellPrice - position.purchasePrice) / position.purchasePrice * 100;
          return <div key={position.symbol} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium">{position.symbol}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {position.name}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span>{position.purchaseDate}</span>
                      <span className="mx-1">→</span>
                      <span>{position.sellDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {position.shares} shares @ $
                      {position.purchasePrice.toFixed(2)} → $
                      {position.sellPrice.toFixed(2)}
                    </span>
                    <div className={`flex items-center ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {gainLoss >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      <span className="font-medium">
                        ${Math.abs(gainLoss).toFixed(2)} (
                        {percentageChange > 0 ? '+' : ''}
                        {percentageChange.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>;
        })}
          </div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Gain/Loss */}
        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Total Gain/Loss
              </span>
              <span className={`text-2xl font-semibold ${performanceData.totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${Math.abs(performanceData.totalGainLoss).toLocaleString()}
              </span>
            </div>
            {performanceData.totalGainLoss >= 0 ? <TrendingUp className="h-6 w-6 text-green-500" /> : <TrendingDown className="h-6 w-6 text-red-500" />}
          </div>
        </div>
        {/* Win Rate */}
        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Win Rate</span>
              <span className={`text-2xl font-semibold ${performanceData.winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                {performanceData.winRate}%
              </span>
            </div>
            {performanceData.winRate >= 50 ? <TrendingUp className="h-6 w-6 text-green-500" /> : <TrendingDown className="h-6 w-6 text-red-500" />}
          </div>
        </div>
        {/* Profitability */}
        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Profitability
              </span>
              <span className={`text-2xl font-semibold ${performanceData.profitability >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {performanceData.profitability}%
              </span>
            </div>
            {performanceData.profitability >= 0 ? <TrendingUp className="h-6 w-6 text-green-500" /> : <TrendingDown className="h-6 w-6 text-red-500" />}
          </div>
        </div>
      </div>
      {/* Total Committed */}
      <div className="p-4 rounded-lg bg-muted/30">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Total Invested</span>
          <span className="text-2xl font-semibold">
            ${performanceData.totalCommitted.toLocaleString()}
          </span>
        </div>
      </div>
      {/* ROI */}
      <div className="p-4 rounded-lg bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">
              Return on Investment
            </span>
            <span className={`text-2xl font-semibold ${roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {roi.toFixed(2)}%
            </span>
          </div>
          {roi >= 0 ? <TrendingUp className="h-6 w-6 text-green-500" /> : <TrendingDown className="h-6 w-6 text-red-500" />}
        </div>
      </div>
    </div>;
}
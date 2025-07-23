import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Check } from 'lucide-react';
import { AIAnalysis } from '../components/stock/AIAnalysis';
interface DetailedStock {
  symbol: string;
  name: string;
  ask: number;
  askSize: number;
  bid: number;
  bidSize: number;
  high: number;
  high52: number;
  low: number;
  low52: number;
  openInterest: number;
  beta: number;
  week52LowDate: string;
  week52HighDate: string;
  intrinsicValue: number;
  timePremium: number;
  optionMultiplier: number;
  averageVolume: string;
  currentPrice: number;
  dayChange: number;
}
const mockStocks: DetailedStock[] = [{
  symbol: 'AAPL',
  name: 'Apple Inc.',
  ask: 198.45,
  askSize: 500,
  bid: 198.35,
  bidSize: 300,
  high: 198.89,
  high52: 199.62,
  low: 197.15,
  low52: 124.17,
  openInterest: 245000,
  beta: 1.28,
  week52LowDate: '2023-01-03',
  week52HighDate: '2023-12-14',
  intrinsicValue: 185.23,
  timePremium: 13.22,
  optionMultiplier: 100,
  averageVolume: '52.3M',
  currentPrice: 198.11,
  dayChange: 2.3
}, {
  symbol: 'MSFT',
  name: 'Microsoft Corporation',
  ask: 374.92,
  askSize: 300,
  bid: 374.82,
  bidSize: 200,
  high: 375.12,
  high52: 375.98,
  low: 373.25,
  low52: 219.35,
  openInterest: 185000,
  beta: 0.98,
  week52LowDate: '2023-01-06',
  week52HighDate: '2023-12-15',
  intrinsicValue: 362.45,
  timePremium: 12.47,
  optionMultiplier: 100,
  averageVolume: '28.7M',
  currentPrice: 374.58,
  dayChange: 1.8
}, {
  symbol: 'NVDA',
  name: 'NVIDIA Corporation',
  ask: 481.35,
  askSize: 200,
  bid: 481.05,
  bidSize: 150,
  high: 483.45,
  high52: 483.45,
  low: 479.22,
  low52: 138.84,
  openInterest: 320000,
  beta: 1.75,
  week52LowDate: '2022-12-28',
  week52HighDate: '2023-12-15',
  intrinsicValue: 455.67,
  timePremium: 25.44,
  optionMultiplier: 100,
  averageVolume: '45.2M',
  currentPrice: 481.11,
  dayChange: 3.2
}];
export function DetailedStockView() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    completedTrade
  } = location.state || {};
  const [analysisStates, setAnalysisStates] = useState<Record<string, boolean>>({});
  const isTradeCompleted = (symbol: string) => {
    return completedTrade === symbol;
  };
  const isBulkTradeCompleted = completedTrade === 'BULK';
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <header className="border-b">
          <div className="container mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between relative">
              <button onClick={() => navigate('/')} className="p-2 hover:bg-muted rounded-md transition-colors" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold">52-Week High Stocks</h1>
              <div className="w-10" /> {/* Spacer for alignment */}
            </div>
          </div>
        </header>
        <div className="container mx-auto p-4">
          <div className="grid gap-6">
            {mockStocks.map(stock => <div key={stock.symbol} className="bg-card rounded-lg shadow-sm border p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{stock.symbol}</h3>
                    <p className="text-muted-foreground">{stock.name}</p>
                  </div>
                  <div className={`flex items-center ${stock.dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.dayChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                    <span>
                      {stock.dayChange > 0 ? '+' : ''}
                      {stock.dayChange}%
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Ask/Size</p>
                    <p className="font-medium">
                      ${stock.ask} / {stock.askSize}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bid/Size</p>
                    <p className="font-medium">
                      ${stock.bid} / {stock.bidSize}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      52W High/Low
                    </p>
                    <p className="font-medium">
                      ${stock.high52} / ${stock.low52}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Option Multiplier
                    </p>
                    <p className="font-medium">{stock.optionMultiplier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Volume</p>
                    <p className="font-medium">{stock.averageVolume}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <AIAnalysis stock={stock} isExpanded={analysisStates[stock.symbol]} onToggle={() => {
                setAnalysisStates(prev => ({
                  ...prev,
                  [stock.symbol]: !prev[stock.symbol]
                }));
              }} />
                  {isTradeCompleted(stock.symbol) ? <button disabled className="w-full bg-green-500 text-white rounded-md py-4 flex items-center justify-center gap-2">
                      <Check className="h-5 w-5" />
                      Trade Executed
                    </button> : <button onClick={() => navigate('/trade', {
                state: {
                  stock
                }
              })} className="w-full bg-primary text-primary-foreground rounded-md py-4 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                      Execute Trade
                    </button>}
                </div>
              </div>)}
          </div>
          <div className="mt-8 border-t pt-6">
            {isBulkTradeCompleted ? <button disabled className="w-full bg-green-500 text-white rounded-md py-4 flex items-center justify-center gap-2">
                <Check className="h-5 w-5" />
                Trade Executed
              </button> : <button onClick={() => navigate('/bulk-trade', {
            state: {
              stocks: mockStocks
            }
          })} className="w-full bg-primary/10 text-primary rounded-md py-4 hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
                Execute Bulk Trade
              </button>}
          </div>
        </div>
      </div>
    </div>;
}
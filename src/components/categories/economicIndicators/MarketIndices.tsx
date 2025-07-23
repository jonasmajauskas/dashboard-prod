import { TrendingUp, TrendingDown } from 'lucide-react';
interface MarketIndex {
  name: string;
  value: number;
  change: number;
  volume: string;
}
const marketIndices: MarketIndex[] = [{
  name: 'NASDAQ Composite',
  value: 14970.12,
  change: 0.95,
  volume: '1.2B'
}, {
  name: 'S&P 500',
  value: 4740.28,
  change: 0.75,
  volume: '2.3B'
}, {
  name: 'Dow Jones',
  value: 37248.35,
  change: 0.43,
  volume: '423M'
}, {
  name: 'Russell 2000',
  value: 1987.76,
  change: -0.22,
  volume: '891M'
}, {
  name: 'MSCI World',
  value: 3242.88,
  change: 0.65,
  volume: '156M'
}];
export function MarketIndices() {
  return <div className="space-y-4">
      {marketIndices.map(index => <div key={index.name} className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{index.name}</span>
            <span className="text-sm text-muted-foreground">
              Vol: {index.volume}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">
              {index.value.toLocaleString()}
            </span>
            <div className={`flex items-center ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {index.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span className="font-medium">
                {index.change > 0 ? '+' : ''}
                {index.change}%
              </span>
            </div>
          </div>
        </div>)}
    </div>;
}
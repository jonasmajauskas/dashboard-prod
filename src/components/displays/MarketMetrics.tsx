import { TrendingUp } from 'lucide-react';
interface StockHigh {
  symbol: string;
  price: number;
  appreciation: number;
}
// Mock data - in real app, this would come from an API
const mockStockHighs: StockHigh[] = [{
  symbol: 'AAPL',
  price: 198.45,
  appreciation: 2.3
}, {
  symbol: 'MSFT',
  price: 378.92,
  appreciation: 1.8
}, {
  symbol: 'NVDA',
  price: 485.12,
  appreciation: 3.2
}, {
  symbol: 'GOOGL',
  price: 142.65,
  appreciation: 1.5
}];
export function MarketMetrics() {
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">New 52-Week Highs</span>
        <span className="text-sm text-muted-foreground">
          {mockStockHighs.length} stocks
        </span>
      </div>
      <div className="space-y-2">
        {mockStockHighs.map(stock => <div key={stock.symbol} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <span className="font-medium">{stock.symbol}</span>
              <span className="text-sm text-muted-foreground">
                ${stock.price.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center text-green-500 text-sm">
              <TrendingUp className="h-3 w-3 mr-1" />+
              {stock.appreciation.toFixed(1)}%
            </div>
          </div>)}
      </div>
    </div>;
}
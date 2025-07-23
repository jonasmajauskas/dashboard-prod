import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface Stock {
  symbol: string;
  name: string;
  shares: number;
  price: number;
  change: number;
}
const growthStocks: Stock[] = [{
  symbol: 'AAPL',
  name: 'Apple Inc.',
  shares: 50,
  price: 198.11,
  change: 2.3
}, {
  symbol: 'MSFT',
  name: 'Microsoft',
  shares: 30,
  price: 374.58,
  change: 1.8
}, {
  symbol: 'NVDA',
  name: 'NVIDIA Corp',
  shares: 25,
  price: 481.11,
  change: 3.2
}];
export function GrowthPortfolio() {
  const navigate = useNavigate();
  const totalValue = growthStocks.reduce((sum, stock) => sum + stock.price * stock.shares, 0);
  return <div className="space-y-4">
      <div className="p-4 rounded-lg bg-muted/30">
        <div className="flex flex-col">
          <span className="text-3xl font-semibold">
            ${totalValue.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground mt-1">
            {growthStocks.length} stocks tracked
          </span>
        </div>
      </div>
      <button className="w-full flex items-center justify-center text-sm text-muted-foreground cursor-pointer" onClick={() => navigate('/growth-portfolio')}>
        <span>View portfolio details</span>
        <ChevronRight className="h-4 w-4 ml-1 transition-transform hover:translate-x-0.5" />
      </button>
    </div>;
}
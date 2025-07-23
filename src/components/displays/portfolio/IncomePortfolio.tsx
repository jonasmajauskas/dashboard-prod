import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface Stock {
  symbol: string;
  name: string;
  shares: number;
  price: number;
  change: number;
}
const incomeStocks: Stock[] = [{
  symbol: 'JNJ',
  name: 'Johnson & Johnson',
  shares: 45,
  price: 155.16,
  change: -0.5
}, {
  symbol: 'PG',
  name: 'Procter & Gamble',
  shares: 60,
  price: 144.67,
  change: 0.8
}, {
  symbol: 'KO',
  name: 'Coca-Cola Co',
  shares: 100,
  price: 58.32,
  change: 0.3
}];
export function IncomePortfolio() {
  const navigate = useNavigate();
  const totalValue = incomeStocks.reduce((sum, stock) => sum + stock.price * stock.shares, 0);
  return <div className="space-y-4">
      <div className="p-4 rounded-lg bg-muted/30">
        <div className="flex flex-col">
          <span className="text-3xl font-semibold">
            ${totalValue.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground mt-1">
            {incomeStocks.length} stocks tracked
          </span>
        </div>
      </div>
      <button className="w-full flex items-center justify-center text-sm text-muted-foreground cursor-pointer" onClick={() => navigate('/income-portfolio')}>
        <span>View portfolio details</span>
        <ChevronRight className="h-4 w-4 ml-1 transition-transform hover:translate-x-0.5" />
      </button>
    </div>;
}
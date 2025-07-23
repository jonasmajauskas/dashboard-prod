import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
export function IncomePortfolioView() {
  const navigate = useNavigate();
  const totalValue = incomeStocks.reduce((sum, stock) => sum + stock.price * stock.shares, 0);
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-muted rounded-md transition-colors" aria-label="Go back to dashboard">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-semibold">Income Portfolio</h1>
          </div>
        </header>
        <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">
                ${totalValue.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                Total Portfolio Value
              </span>
            </div>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">Symbol</th>
                  <th className="text-left pb-2">Name</th>
                  <th className="text-right pb-2">Shares</th>
                  <th className="text-right pb-2">Price</th>
                  <th className="text-right pb-2">Value</th>
                  <th className="text-right pb-2">Weight</th>
                </tr>
              </thead>
              <tbody>
                {incomeStocks.map(stock => {
                const stockValue = stock.price * stock.shares;
                const weight = stockValue / totalValue * 100;
                return <tr key={stock.symbol} className="border-b last:border-0">
                      <td className="py-4 font-medium">{stock.symbol}</td>
                      <td className="py-4">{stock.name}</td>
                      <td className="py-4 text-right">{stock.shares}</td>
                      <td className="py-4 text-right">
                        ${stock.price.toFixed(2)}
                      </td>
                      <td className="py-4 text-right">
                        ${stockValue.toLocaleString()}
                      </td>
                      <td className="py-4 text-right">{weight.toFixed(1)}%</td>
                    </tr>;
              })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
}
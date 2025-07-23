import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
export function GrowthPortfolioView() {
  const navigate = useNavigate();
  const totalValue = growthStocks.reduce((sum, stock) => sum + stock.price * stock.shares, 0);
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-muted rounded-md transition-colors" aria-label="Go back to dashboard">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-semibold">Growth Portfolio</h1>
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
                {growthStocks.map(stock => {
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
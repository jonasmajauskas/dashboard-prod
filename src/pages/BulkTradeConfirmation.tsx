import { useNavigate, useLocation } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';
export function BulkTradeConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    trade,
    stocks
  } = location.state || {};
  const calculateAllocation = () => {
    const amountPerStock = trade.amount / stocks.length;
    return stocks.map((stock: any) => ({
      symbol: stock.symbol,
      shares: Math.floor(amountPerStock / stock.currentPrice),
      totalCost: Math.floor(amountPerStock / stock.currentPrice) * stock.currentPrice
    }));
  };
  const allocation = calculateAllocation();
  const totalInvested = allocation.reduce((sum: number, stock: any) => sum + stock.totalCost, 0);
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <header className="border-b">
          <div className="container mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between relative">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-md transition-colors" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold">Review Order</h1>
              <div className="w-10" /> {/* Spacer for alignment */}
            </div>
          </div>
        </header>
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm border p-6 text-center">
            <div className="mb-6">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-semibold mb-2">
                AI-Generated Allocation
              </h1>
              <p className="text-muted-foreground">
                Here's how your ${trade.amount.toLocaleString()} will be
                invested
              </p>
            </div>
            <div className="space-y-4 mb-8 text-left">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="grid gap-4">
                  {allocation.map((stock: any) => <div key={stock.symbol} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {stock.shares} shares
                        </span>
                      </div>
                      <span className="font-medium">
                        ${stock.totalCost.toFixed(2)}
                      </span>
                    </div>)}
                  <div className="border-t pt-4 flex justify-between">
                    <span className="font-medium">Total Investment</span>
                    <span className="font-medium">
                      ${totalInvested.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Remaining Cash</span>
                    <span>${(trade.amount - totalInvested).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <button onClick={() => navigate('/stock-analysis', {
              state: {
                completedTrade: 'BULK'
              }
            })} className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
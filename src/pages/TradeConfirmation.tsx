import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
export function TradeConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    trade,
    stock
  } = location.state || {};
  const estimatedTotal = trade?.quantity * (trade?.limitPrice || stock?.currentPrice);
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm border p-6 text-center">
            <div className="mb-6">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-semibold mb-2">Order Confirmed</h1>
              <p className="text-muted-foreground">
                Your trade has been successfully submitted
              </p>
            </div>
            <div className="space-y-4 mb-8 text-left">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h2 className="font-semibold mb-4">Order Details</h2>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Symbol</span>
                    <span className="font-medium">{stock?.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Type</span>
                    <span className="font-medium capitalize">
                      {trade?.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium">
                      {trade?.quantity} shares
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">
                      ${trade?.limitPrice || stock?.currentPrice}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Estimated Total
                    </span>
                    <span className="font-medium">
                      ${estimatedTotal?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <button onClick={() => navigate('/stock-analysis', {
              state: {
                completedTrade: stock?.symbol
              }
            })} className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                Return to 52-Week High Stocks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
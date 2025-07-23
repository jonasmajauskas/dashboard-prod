import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
interface PastPosition {
  symbol: string;
  name: string;
  purchaseDate: string;
  sellDate: string;
  purchasePrice: number;
  sellPrice: number;
  shares: number;
}
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
export function PastPositions() {
  const navigate = useNavigate();
  // Calculate total realized gains/losses
  const totalRealizedValue = pastPositions.reduce((total, position) => {
    const positionGainLoss = (position.sellPrice - position.purchasePrice) * position.shares;
    return total + positionGainLoss;
  }, 0);
  return <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6">
        <header className="flex items-center mb-6">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-muted rounded-md transition-colors" aria-label="Go back">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold ml-2">Past Positions</h1>
        </header>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  Total Realized P/L
                </span>
                <span className={`text-2xl font-semibold ${totalRealizedValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${totalRealizedValue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {pastPositions.map(position => {
            const gainLoss = (position.sellPrice - position.purchasePrice) * position.shares;
            const percentageChange = (position.sellPrice - position.purchasePrice) / position.purchasePrice * 100;
            const totalInvestment = position.purchasePrice * position.shares;
            const totalReturn = position.sellPrice * position.shares;
            return <div key={position.symbol} className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-baseline">
                        <span className="text-xl font-semibold">
                          {position.symbol}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {position.name}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {position.purchaseDate} → {position.sellDate}
                      </div>
                    </div>
                    <div className={`flex items-center ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {gainLoss >= 0 ? <TrendingUp className="h-5 w-5 mr-1" /> : <TrendingDown className="h-5 w-5 mr-1" />}
                      <span className="font-medium">
                        {percentageChange > 0 ? '+' : ''}
                        {percentageChange.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground block">
                        Investment
                      </span>
                      <span className="text-lg font-medium">
                        ${totalInvestment.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block">
                        Return
                      </span>
                      <span className="text-lg font-medium">
                        ${totalReturn.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {position.shares.toLocaleString()} shares @ $
                    {position.purchasePrice.toFixed(2)} → $
                    {position.sellPrice.toFixed(2)}
                  </div>
                  <div className={`mt-2 font-medium ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    Net P/L: ${Math.abs(gainLoss).toLocaleString()}
                  </div>
                </div>;
          })}
          </div>
        </div>
      </div>
    </div>;
}
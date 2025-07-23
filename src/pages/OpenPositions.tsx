import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
interface OpenPosition {
  symbol: string;
  name: string;
  purchaseDate: string;
  purchasePrice: number;
  currentPrice: number;
  shares: number;
}
const openPositions: OpenPosition[] = [{
  symbol: 'AAPL',
  name: 'Apple Inc.',
  purchaseDate: '2023-09-15',
  purchasePrice: 175.24,
  currentPrice: 198.11,
  shares: 100
}, {
  symbol: 'MSFT',
  name: 'Microsoft Corporation',
  purchaseDate: '2023-10-01',
  purchasePrice: 312.45,
  currentPrice: 374.58,
  shares: 50
}, {
  symbol: 'GOOGL',
  name: 'Alphabet Inc.',
  purchaseDate: '2023-11-05',
  purchasePrice: 132.18,
  currentPrice: 142.65,
  shares: 75
}, {
  symbol: 'META',
  name: 'Meta Platforms Inc.',
  purchaseDate: '2023-08-20',
  purchasePrice: 292.87,
  currentPrice: 334.92,
  shares: 60
}];
export function OpenPositions() {
  const navigate = useNavigate();
  // Calculate total investment and position values
  const totalInvestment = openPositions.reduce((total, position) => total + position.purchasePrice * position.shares, 0);
  const handlePositionClick = (position: OpenPosition) => {
    navigate('/trade', {
      state: {
        stock: {
          symbol: position.symbol,
          name: position.name,
          currentPrice: position.currentPrice
        },
        defaultValues: {
          type: 'sell',
          quantity: position.shares
        }
      }
    });
  };
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <header className="border-b">
          <div className="container mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between relative">
              <button onClick={() => navigate('/')} className="p-2 hover:bg-muted rounded-md transition-colors" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold">Open Positions</h1>
              <div className="flex items-center">
                <span className="font-medium md:block hidden">
                  {openPositions.length} Positions
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 mt-8">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Total Investment ({openPositions.length} Positions)
                  </span>
                  <span className="text-2xl font-semibold">
                    ${totalInvestment.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {openPositions.map(position => {
              const investmentAmount = position.purchasePrice * position.shares;
              const percentageOfTotal = investmentAmount / totalInvestment * 100;
              const gainLoss = (position.currentPrice - position.purchasePrice) * position.shares;
              const percentageChange = (position.currentPrice - position.purchasePrice) / position.purchasePrice * 100;
              return <div key={position.symbol} className="p-4 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handlePositionClick(position)}>
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
                        <span className="text-sm text-muted-foreground">
                          Opened: {position.purchaseDate}
                        </span>
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
                          ${investmentAmount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground block">
                          Portfolio %
                        </span>
                        <span className="text-lg font-medium">
                          {percentageOfTotal.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {position.shares.toLocaleString()} shares @ $
                      {position.purchasePrice.toFixed(2)}
                    </div>
                  </div>;
            })}
            </div>
          </div>
        </div>
      </div>
    </div>;
}
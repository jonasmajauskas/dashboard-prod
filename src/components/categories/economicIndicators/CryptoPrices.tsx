import { TrendingUp, TrendingDown } from 'lucide-react';
interface CryptoMetric {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume24h: string;
  high52Week: number;
}
const cryptoData: CryptoMetric[] = [{
  name: 'Bitcoin',
  symbol: 'BTC',
  price: 42568.23,
  change24h: 2.4,
  marketCap: '831.2B',
  volume24h: '28.4B',
  high52Week: 44111.68
}, {
  name: 'Ethereum',
  symbol: 'ETH',
  price: 2245.89,
  change24h: 1.8,
  marketCap: '269.8B',
  volume24h: '12.1B',
  high52Week: 2391.51
}, {
  name: 'Solana',
  symbol: 'SOL',
  price: 74.56,
  change24h: 5.2,
  marketCap: '31.9B',
  volume24h: '3.8B',
  high52Week: 79.23
}, {
  name: 'Binance Coin',
  symbol: 'BNB',
  price: 264.32,
  change24h: -0.6,
  marketCap: '40.7B',
  volume24h: '1.2B',
  high52Week: 289.42
}, {
  name: 'XRP',
  symbol: 'XRP',
  price: 0.62,
  change24h: 1.2,
  marketCap: '33.5B',
  volume24h: '1.8B',
  high52Week: 0.89
}];
export function CryptoPrices() {
  return <div className="space-y-4">
      <div className="space-y-3">
        {cryptoData.map(crypto => <div key={crypto.symbol} className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-medium">{crypto.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {crypto.symbol}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Vol: ${crypto.volume24h}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                ${crypto.price.toLocaleString()}
              </span>
              <div className={`flex items-center ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {crypto.change24h >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                <span className="font-medium">
                  {crypto.change24h > 0 ? '+' : ''}
                  {crypto.change24h}%
                </span>
              </div>
            </div>
            {crypto.price >= crypto.high52Week * 0.95 && <div className="mt-2 text-xs text-green-500">
                Near 52W High: ${crypto.high52Week.toLocaleString()}
              </div>}
          </div>)}
      </div>
    </div>;
}
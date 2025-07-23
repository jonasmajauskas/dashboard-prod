import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
interface BulkTradeFormData {
  amount: number;
  orderType: 'market' | 'limit';
  timeInForce: 'day' | 'gtc';
}
export function BulkTradeForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    stocks
  } = location.state || {};
  const [selectedStocks, setSelectedStocks] = useState<string[]>(stocks?.map((s: any) => s.symbol) || []);
  const [formData, setFormData] = useState<BulkTradeFormData>({
    amount: 0,
    orderType: 'market',
    timeInForce: 'day'
  });
  const handleStockToggle = (symbol: string) => {
    setSelectedStocks(prev => prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredStocks = stocks.filter((stock: any) => selectedStocks.includes(stock.symbol));
    navigate('/bulk-trade-confirmation', {
      state: {
        trade: formData,
        stocks: filteredStocks
      }
    });
  };
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <header className="border-b">
          <div className="container mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between relative">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-md transition-colors" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold">Execute Bulk Trade</h1>
              <div className="w-10" /> {/* Spacer for alignment */}
            </div>
          </div>
        </header>
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Select Stocks</h2>
              <p className="text-muted-foreground">
                Choose which stocks to include in your bulk trade
              </p>
            </div>
            <div className="mb-6 space-y-3">
              {stocks?.map((stock: any) => <div key={stock.symbol} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id={stock.symbol} checked={selectedStocks.includes(stock.symbol)} onChange={() => handleStockToggle(stock.symbol)} className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor={stock.symbol} className="flex flex-col">
                      <span className="font-medium">{stock.symbol}</span>
                      <span className="text-sm text-muted-foreground">
                        ${stock.currentPrice}
                      </span>
                    </label>
                  </div>
                  <div className={`flex items-center ${stock.dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.dayChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                    <span>
                      {stock.dayChange > 0 ? '+' : ''}
                      {stock.dayChange}%
                    </span>
                  </div>
                </div>)}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Total Investment Amount
                  </label>
                  <input type="number" min="1" step="0.01" className="w-full p-2 rounded-md border bg-background" value={formData.amount} onChange={e => setFormData({
                  ...formData,
                  amount: parseFloat(e.target.value) || 0
                })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price Type
                  </label>
                  <select className="w-full p-2 rounded-md border bg-background" value={formData.orderType} onChange={e => setFormData({
                  ...formData,
                  orderType: e.target.value as 'market' | 'limit'
                })}>
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Time in Force
                  </label>
                  <select className="w-full p-2 rounded-md border bg-background" value={formData.timeInForce} onChange={e => setFormData({
                  ...formData,
                  timeInForce: e.target.value as 'day' | 'gtc'
                })}>
                    <option value="day">Day</option>
                    <option value="gtc">Good Till Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={selectedStocks.length === 0} className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Review Order ({selectedStocks.length} stocks selected)
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>;
}
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
interface TradeFormData {
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  orderType: 'market' | 'limit';
  limitPrice?: number;
  timeInForce: 'day' | 'gtc';
}
export function TradeForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    stock
  } = location.state || {};
  const [formData, setFormData] = useState<TradeFormData>({
    symbol: stock?.symbol || '',
    type: 'buy',
    quantity: 0,
    orderType: 'market',
    timeInForce: 'day'
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/trade-confirmation', {
      state: {
        trade: formData,
        stock
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
              <h1 className="text-lg font-semibold">Execute Trade</h1>
              <div className="w-10" /> {/* Spacer for alignment */}
            </div>
          </div>
        </header>
        <div className="max-w-2xl mx-auto mt-6">
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">{stock?.name}</h2>
              <p className="text-muted-foreground">
                Current Price: ${stock?.currentPrice}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Order Type
                  </label>
                  <select className="w-full p-2 rounded-md border bg-background" value={formData.type} onChange={e => setFormData({
                  ...formData,
                  type: e.target.value as 'buy' | 'sell'
                })}>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantity
                  </label>
                  <input type="number" min="1" className="w-full p-2 rounded-md border bg-background" value={formData.quantity} onChange={e => setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 0
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
                {formData.orderType === 'limit' && <div>
                    <label className="block text-sm font-medium mb-2">
                      Limit Price
                    </label>
                    <input type="number" step="0.01" className="w-full p-2 rounded-md border bg-background" value={formData.limitPrice || ''} onChange={e => setFormData({
                  ...formData,
                  limitPrice: parseFloat(e.target.value) || undefined
                })} required />
                  </div>}
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
                <button type="submit" className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                  Review Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>;
}
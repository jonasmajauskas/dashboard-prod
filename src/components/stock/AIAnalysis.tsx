import { useState } from 'react';
import { LineChart } from 'lucide-react';
interface AIAnalysisProps {
  stock: {
    symbol: string;
    name: string;
    currentPrice: number;
    beta: number;
    intrinsicValue: number;
    averageVolume: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
}
interface AnalysisResult {
  recommendation: string;
  shares: number;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  holdPeriod: string;
  risk: string;
  confidence: number;
  reasoning: string;
}
export function AIAnalysis({
  stock,
  isExpanded,
  onToggle
}: AIAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const generateAnalysis = () => {
    const premium = (stock.currentPrice - stock.intrinsicValue) / stock.intrinsicValue * 100;
    const isOvervalued = premium > 5;
    const confidence = Math.floor(Math.random() * 20) + 70; // Random confidence between 70-90%
    return {
      recommendation: isOvervalued ? 'Hold' : 'Buy',
      shares: Math.floor(Math.random() * 50) + 10,
      entryPrice: stock.currentPrice,
      targetPrice: stock.currentPrice * (1 + (Math.random() * 0.2 + 0.1)),
      stopLoss: stock.currentPrice * (1 - (Math.random() * 0.1 + 0.05)),
      holdPeriod: isOvervalued ? 'Wait for pullback' : '6-8 months',
      risk: stock.beta > 1.3 ? 'High' : stock.beta > 0.8 ? 'Medium' : 'Low',
      confidence,
      reasoning: `Based on our analysis of ${stock.symbol}, the stock ${isOvervalued ? 'appears to be trading at a premium to its intrinsic value' : 'shows potential for appreciation'}. With a beta of ${stock.beta} and average volume of ${stock.averageVolume}, 
      the stock demonstrates ${stock.beta > 1 ? 'higher' : 'lower'} volatility than the market. 
      ${confidence > 80 ? 'Technical indicators strongly support this analysis.' : 'Market conditions suggest moderate conviction in this analysis.'}`
    };
  };
  const analyzeStock = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAnalysis(generateAnalysis());
      setIsLoading(false);
    }, 1500);
  };
  if (!isExpanded) {
    return <button onClick={() => {
      onToggle();
      if (!analysis && !isLoading) analyzeStock();
    }} className="w-full bg-primary/10 text-primary rounded-md py-4 hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
        <LineChart className="h-5 w-5" />
        Get AI Analysis
      </button>;
  }
  if (isLoading) {
    return <div className="mt-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Analyzing {stock.symbol}...
        </p>
      </div>;
  }
  if (!analysis) return null;
  return <div className="mt-4 bg-muted/30 rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-semibold">AI Analysis Results</h4>
        <span className="text-sm text-muted-foreground">
          {analysis.confidence}% confidence
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Recommendation</p>
            <p className={`font-medium ${analysis.recommendation === 'Buy' ? 'text-green-500' : 'text-yellow-500'}`}>
              {analysis.recommendation}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Position Size</p>
            <p className="font-medium">{analysis.shares} shares</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Hold Period</p>
            <p className="font-medium">{analysis.holdPeriod}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Risk Level</p>
            <p className={`font-medium ${analysis.risk === 'High' ? 'text-red-500' : analysis.risk === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>
              {analysis.risk}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Entry Price</p>
            <p className="font-medium">${analysis.entryPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Target Price</p>
            <p className="font-medium text-green-500">
              ${analysis.targetPrice.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Stop Loss</p>
            <p className="font-medium text-red-500">
              ${analysis.stopLoss.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-muted-foreground">Analysis</p>
          <p className="text-sm mt-1">{analysis.reasoning}</p>
        </div>
      </div>
    </div>;
}
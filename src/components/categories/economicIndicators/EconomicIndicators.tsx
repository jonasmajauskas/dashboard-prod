
// Mock data - in real app, this would come from an API
const economicData = {
  rates: [{
    name: 'Fed Funds Rate',
    value: 5.5,
    lastUpdated: '2023-12-13'
  }, {
    name: 'Prime Rate',
    value: 8.75,
    lastUpdated: '2023-12-13'
  }, {
    name: 'Inflation Rate (CPI)',
    value: 3.1,
    lastUpdated: '2023-11-30'
  }, {
    name: '10-Year Treasury',
    value: 3.92,
    lastUpdated: '2023-12-14'
  }, {
    name: '2-Year Treasury',
    value: 4.34,
    lastUpdated: '2023-12-14'
  }, {
    name: '30-Year Mortgage',
    value: 6.95,
    lastUpdated: '2023-12-14'
  }, {
    name: '60-Month Auto Loan',
    value: 7.15,
    lastUpdated: '2023-12-14'
  }, {
    name: 'Avg Credit Card APR',
    value: 20.75,
    lastUpdated: '2023-12-14'
  }]
};
export function EconomicIndicators() {
  return <div className="space-y-0 divide-y">
      {economicData.rates.map(rate => <div key={rate.name} className="flex items-center justify-between p-2 hover:bg-muted/50 transition-colors">
          <div>
            <span className="text-sm font-medium">{rate.name}</span>
          </div>
          <div>
            <span className="text-lg font-semibold tabular-nums">
              {rate.value.toFixed(2)}%
            </span>
          </div>
        </div>)}
    </div>;
}
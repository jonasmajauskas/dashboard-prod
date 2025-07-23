interface EconomyMetric {
  name: string;
  code: string; // Added country code for flag
  gdpGrowth: number;
  gdpTotal: number;
  inflation: number;
  unemployment: number;
  interestRate: number;
  currency: string;
  currencyChange: number;
  currencyRate: number;
}
const economyData: EconomyMetric[] = [{
  name: 'United States',
  code: 'US',
  gdpGrowth: 4.9,
  gdpTotal: 26948,
  inflation: 3.1,
  unemployment: 3.7,
  interestRate: 5.5,
  currency: 'USD',
  currencyChange: 0.0,
  currencyRate: 1
}, {
  name: 'Germany',
  code: 'DE',
  gdpGrowth: -0.1,
  gdpTotal: 4429,
  inflation: 3.2,
  unemployment: 5.8,
  interestRate: 4.5,
  currency: 'EUR',
  currencyChange: -0.2,
  currencyRate: 1.09
}, {
  name: 'United Kingdom',
  code: 'GB',
  gdpGrowth: 0.3,
  gdpTotal: 3070,
  inflation: 4.6,
  unemployment: 4.2,
  interestRate: 5.25,
  currency: 'GBP',
  currencyChange: -0.3,
  currencyRate: 1.27
}, {
  name: 'China',
  code: 'CN',
  gdpGrowth: 4.9,
  gdpTotal: 17886,
  inflation: -0.2,
  unemployment: 5.0,
  interestRate: 3.45,
  currency: 'CNY',
  currencyChange: -0.4,
  currencyRate: 0.14
}, {
  name: 'Japan',
  code: 'JP',
  gdpGrowth: 1.1,
  gdpTotal: 4231,
  inflation: 2.8,
  unemployment: 2.5,
  interestRate: -0.1,
  currency: 'JPY',
  currencyChange: -0.6,
  currencyRate: 0.007
}];
// Function to get flag emoji from country code
const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};
export function GlobalEconomics() {
  return <div className="space-y-2">
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden md:grid md:grid-cols-5 gap-4 text-xs font-medium text-muted-foreground">
        <div className="text-center">Country</div>
        <div className="text-center">GDP</div>
        <div className="text-center">Interest Rate</div>
        <div className="text-center">Inflation</div>
        <div className="text-center">Unemployment</div>
      </div>
      <div className="space-y-2">
        {economyData.map(economy => <div key={economy.name} className="border rounded-lg bg-card shadow-sm">
            {/* Mobile Layout */}
            <div className="md:hidden p-3 space-y-2">
              <div className="font-medium text-center">
                <span className="mr-2">{getFlagEmoji(economy.code)}</span>
                {economy.name}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">GDP</div>
                  <div>
                    <span>${(economy.gdpTotal / 1000).toFixed(1)}T</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">
                    Interest Rate
                  </div>
                  <div>{economy.interestRate}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Inflation</div>
                  <div>{economy.inflation}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">
                    Unemployment
                  </div>
                  <div>{economy.unemployment}%</div>
                </div>
              </div>
            </div>
            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-5 gap-4 text-sm p-3">
              <div className="font-medium text-center">
                <span className="mr-2">{getFlagEmoji(economy.code)}</span>
                {economy.name}
              </div>
              <div className="text-center">
                <span>${(economy.gdpTotal / 1000).toFixed(1)}T</span>
              </div>
              <div className="text-center">{economy.interestRate}%</div>
              <div className="text-center">{economy.inflation}%</div>
              <div className="text-center">{economy.unemployment}%</div>
            </div>
          </div>)}
      </div>
    </div>;
}
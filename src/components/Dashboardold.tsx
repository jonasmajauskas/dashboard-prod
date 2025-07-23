import React, { useEffect, useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import { fetchDashboardData } from '../utils/fetchData';
import { Globe, DollarSign, TrendingUp, Bitcoin, Sun, Moon, Percent, ArrowLeft, ChevronDown } from 'lucide-react';
// Highs imports
// import { StockHighs } from './categories/highs/StockHighs';
// import { DayGainLoss } from './categories/highs/DayGainLoss';
// import { WeekGainLoss } from './categories/highs/WeekGainLoss';
// import { MonthGainLoss } from './categories/highs/MonthGainLoss';
// import { YesterdayHighs } from './categories/highs/YesterdayHighs';
// // Economic imports
// import { GlobalEconomics } from './categories/economicIndicators/GlobalEconomics';
// import { MarketIndices } from './categories/economicIndicators/MarketIndices';
// import { EconomicIndicators } from './categories/economicIndicators/EconomicIndicators';
// import { CryptoPrices } from './categories/economicIndicators/CryptoPrices';
// // Portfolio imports
// import { IncomePortfolio } from './categories/portfolio/IncomePortfolio';
// import { GrowthPortfolio } from './categories/portfolio/GrowthPortfolio';
// Performance imports
import { PerformanceMetrics } from './displays/performance/PerformanceMetrics';
import { useHighs } from '../context/HighsContext';
import { useNavigate } from 'react-router-dom';

type DataSource = {
  id: string;
  title: string;
  endpoint: string;
  icon: React.ReactNode;
  type: 'stats' | 'chart' | 'table' | 'market-metrics' | 'economic-indicators' | 'market-indices' | 'global-economics' | 'personal-portfolio' | 'income-portfolio' | 'growth-portfolio' | 'crypto-prices' | 'stock-highs' | 'day-gain-loss' | 'week-gain-loss' | 'month-gain-loss' | 'average-gain-loss-24h' | 'average-gain-loss-7d' | 'average-gain-loss-30d';
  section: 'economic' | 'portfolio' | 'highs';
};
const dataSources: DataSource[] = [
  // Economic Indicators Section
  {
    id: 'globalEconomics',
    title: 'Global Economics',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <Globe className="h-5 w-5" />,
    type: 'global-economics',
    section: 'economic'
  }, {
    id: 'keyRates',
    title: 'Interest Rates',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <Percent className="h-5 w-5" />,
    type: 'economic-indicators',
    section: 'economic'
  }, {
    id: 'cryptoPrices',
    title: 'Cryptocurrency Market',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <Bitcoin className="h-5 w-5" />,
    type: 'crypto-prices',
    section: 'economic'
  }, {
    id: 'marketIndices',
    title: 'Market Indices',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <Globe className="h-5 w-5" />,
    type: 'market-indices',
    section: 'economic'
  },
  // Portfolio Section
  {
    id: 'incomePortfolio',
    title: 'Income Portfolio',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <DollarSign className="h-5 w-5" />,
    type: 'income-portfolio',
    section: 'portfolio'
  }, {
    id: 'growthPortfolio',
    title: 'Growth Portfolio',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <DollarSign className="h-5 w-5" />,
    type: 'growth-portfolio',
    section: 'portfolio'
  },
  // New Highs Section
  {
    id: 'stockHighs',
    title: '52-Week Highs',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <TrendingUp className="h-0 w-0" />,
    type: 'stock-highs',
    section: 'highs'
  }, {
    id: 'dayGainLoss',
    title: '24H Gainers & Losers',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <TrendingUp className="h-0 w-0" />,
    type: 'day-gain-loss',
    section: 'highs'
  }, {
    id: 'weekGainLoss',
    title: '7D Gainers & Losers',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <TrendingUp className="h-0 w-0" />,
    type: 'week-gain-loss',
    section: 'highs'
  }, {
    id: 'monthGainLoss',
    title: '30D Gainers & Losers',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <TrendingUp className="h-0 w-0" />,
    type: 'month-gain-loss',
    section: 'highs'
  }, {
    id: 'yesterdayHighs',
    title: "Yesterday's Highs",
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <TrendingUp className="h-0 w-0" />,
    type: 'stock-highs',
    section: 'highs'
  },
  // New Average Components
  {
    id: 'averageGainLoss24h',
    title: '24H Average Changes',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <TrendingUp className="h-0 w-0" />,
    type: 'average-gain-loss-24h',
    section: 'highs'
  }, {
    id: 'averageGainLoss7d',
    title: '7D Average Changes',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <TrendingUp className="h-0 w-0" />,
    type: 'average-gain-loss-7d',
    section: 'highs'
  }, {
    id: 'averageGainLoss30d',
    title: '30D Average Changes',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <TrendingUp className="h-0 w-0" />,
    type: 'average-gain-loss-30d',
    section: 'highs'
  }];
export function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<Record<string, any>>({})
  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();         // ✅ at top level
  // Add state for section visibility
  const [sectionsVisible, setSectionsVisible] = useState({
    highs: true,
    performance: true,
    economic: true,
    portfolio: true
  });
  // Toggle all sections
  const toggleAllSections = () => {
    const areAllVisible = Object.values(sectionsVisible).every(value => value);
    setSectionsVisible({
      highs: !areAllVisible,
      performance: !areAllVisible,
      economic: !areAllVisible,
      portfolio: !areAllVisible
    });
  };
  // Toggle individual section
  const toggleSection = (section: keyof typeof sectionsVisible) => {
    setSectionsVisible(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const formatDateTime = () => {
    return currentDateTime.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/New_York'
    }) + ' EST';
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  const load500Data = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/initiate-oauth');
      const data = await res.json();

      if (data.oauth_token && data.auth_url) {
        console.log('✅ Request Token:', data.oauth_token);
        console.log('🔗 Opening authorization page:', data.auth_url);

        // Open E*TRADE auth page
        window.open(data.auth_url, '_blank');

        // Prompt user for PIN (verifier)
        const verifier = window.prompt("Enter the PIN shown after authorizing on E*TRADE:");

        if (!verifier) {
          alert('Authorization failed or cancelled.');
          return;
        }

        // Step 2: exchange verifier + token for access token
        const accessRes = await fetch('http://localhost:4000/api/execute-oauth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            oauth_token: data.oauth_token,
            oauth_token_secret: data.oauth_token_secret,
            oauth_verifier: verifier
          })
        });
        const accessData = await accessRes.json();


        if (accessData.authenticated) {
          console.log('🔐 User authenticated with E*TRADE successfully.');
          setIsAuthenticated(true); // ✅ User is authenticated
        } else {
          console.warn('⚠️ Authentication failed.');
        }

        // Optionally check for quote response if enabled server-side
        if (accessData.quotes) {
          console.log('✅ Quotes:', accessData.quotes);
          const newHighs = accessData.quotes.filter((q: any) => q.isNewHigh);
          console.log('📈 Stocks hitting new highs:', newHighs);
        }

      } else {
        console.error('❌ Failed to get request token');
      }
    } catch (error) {
      console.error('🚫 Error during OAuth flow:', error);
    } finally {
      setIsLoading(false);
    }
  };


const findHighs = async () => {
  setIsLoading(true);
  try {
    const res = await fetch('http://localhost:4000/api/fetch-sp500-quotes');
    const data = await res.json();
    console.log('✅ findHighs response:', data);

    if (data) {
      setDashboardData(data)
      setDataLoaded(true)
    }
  } catch (error) {
    console.error('🚫 Error during OAuth flow:', error);
  } finally {
    setIsLoading(false);
  }
};

  // const load500Data = async () => {
  //   setIsLoading(true);
  //   try {
  //     const res = await fetch('http://localhost:4000/api/initiate-oauth');
  //     const data = await res.json();

  //     if (data.oauth_token && data.auth_url) {
  //       console.log('✅ Request Token:', data.oauth_token);
  //       console.log('🔗 Opening authorization page:', data.auth_url);

  //       // Open E*TRADE auth page
  //       window.open(data.auth_url, '_blank');

  //       // Prompt user for PIN (verifier)
  //       const verifier = window.prompt("Enter the PIN shown after authorizing on E*TRADE:");

  //       if (!verifier) {
  //         alert('Authorization failed or cancelled.');
  //         return;
  //       }

  //       // Step 2: exchange verifier + token for access token
  //       const accessRes = await fetch('http://localhost:4000/api/execute-oauth', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           oauth_token: data.oauth_token,
  //           oauth_token_secret: data.oauth_token_secret,
  //           oauth_verifier: verifier
  //         })
  //       });
  //       const accessData = await accessRes.json();

  //     if (accessData.quotes) {
  //       console.log('✅ Quotes:', accessData.quotes);
  //       const newHighs = data.quotes.filter((q: any) => q.isNewHigh);
  //       console.log('📈 Stocks hitting new highs:', newHighs);
  //     } else {
  //       console.error('❌ Failed to get quotes:', data.error);
  //     }

  //       console.log('🎉 Access token response:', accessData.quote);
  //     } else {
  //       console.error('❌ Failed to get request token');
  //     }
  //   } catch (error) {
  //     console.error('🚫 Error during OAuth flow:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchDashboardData(dataSources)
      setDashboardData(data)
      setDataLoaded(true)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return <div className="w-full">
    {!dataLoaded && !isLoading && <EmptyState isAuthenticated={isAuthenticated} findHighs={findHighs} onLoadData={loadDashboardData} onLoadData500={load500Data} theme={theme} toggleTheme={toggleTheme} />}
    {dataLoaded && !isLoading && <>
      <header className="border-b">
        <div className="container mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between relative">
            <button onClick={() => setDataLoaded(false)} className="p-2 hover:bg-muted rounded-md transition-colors" aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold hidden md:block">
              Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <button onClick={toggleAllSections} className="p-2 hover:bg-muted rounded-md transition-colors" aria-label="Toggle all sections">
                <ChevronDown className={`h-5 w-5 transition-transform ${Object.values(sectionsVisible).every(value => value) ? '' : '-rotate-90'}`} />
              </button>
              <button onClick={toggleTheme} className="p-2 hover:bg-muted rounded-md transition-colors" aria-label="Toggle theme">
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        {/* New Highs Section */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between border-b pb-2 cursor-pointer select-none" onClick={() => toggleSection('highs')}>
            <h2 className="text-lg font-semibold">New Highs</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {formatDateTime()}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${sectionsVisible.highs ? '' : '-rotate-90'}`} />
            </div>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 transition-all duration-200 ${sectionsVisible.highs ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            {dataSources.filter(source => source.section === 'highs').map(source => <DashboardCard key={source.id} title={source.title} icon={source.icon} data={dashboardData[source.id]} type={'market-metrics'} />)}
          </div>
        </div>
        {/* Performance Section */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between border-b pb-2 cursor-pointer select-none" onClick={() => toggleSection('performance')}>
            <h2 className="text-lg font-semibold">Performance</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {formatDateTime()}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${sectionsVisible.performance ? '' : '-rotate-90'}`} />
            </div>
          </div>
          <div className={`transition-all duration-200 ${sectionsVisible.performance ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            <PerformanceMetrics />
          </div>
        </div>
        {/* Economic Indicators Section */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between border-b pb-2 cursor-pointer select-none" onClick={() => toggleSection('economic')}>
            <h2 className="text-lg font-semibold">Economic Indicators</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {formatDateTime()}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${sectionsVisible.economic ? '' : '-rotate-90'}`} />
            </div>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 transition-all duration-200 ${sectionsVisible.economic ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            {dataSources.filter(source => source.section === 'economic').map(source => <DashboardCard key={source.id} title={source.title} icon={source.icon} data={dashboardData[source.id]} type={'market-metrics'} />)}
          </div>
        </div>
        {/* Portfolio Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2 cursor-pointer select-none" onClick={() => toggleSection('portfolio')}>
            <h2 className="text-lg font-semibold">Portfolio</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {formatDateTime()}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${sectionsVisible.portfolio ? '' : '-rotate-90'}`} />
            </div>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 transition-all duration-200 ${sectionsVisible.portfolio ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            {dataSources.filter(source => source.section === 'portfolio').map(source => <DashboardCard key={source.id} title={source.title} icon={source.icon} data={dashboardData[source.id]} type={'market-metrics'} />)}
          </div>
        </div>
      </main>
    </>}
    {isLoading && <div className="flex justify-center items-center py-20">
      <LoadingSpinner />
    </div>}
  </div>;
}
import React, { useEffect, useState } from 'react';
import { DashboardCard, DashboardCardProps } from './DashboardCard';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import { fetchDashboardData } from '../utils/fetchData';
import { Globe, DollarSign, TrendingUp, Bitcoin, Sun, Moon, Percent, ChevronDown, LogOut } from 'lucide-react';
// Economic imports
// import { GlobalEconomics } from './categories/economicIndicators/GlobalEconomics';
// import { MarketIndices } from './categories/economicIndicators/MarketIndices';
// import { EconomicIndicators } from './categories/economicIndicators/EconomicIndicators';
// import { CryptoPrices } from './categories/economicIndicators/CryptoPrices';
// // Portfolio imports
// import { IncomePortfolio } from './displays/portfolio/IncomePortfolio';
// import { GrowthPortfolio } from './displays/portfolio/GrowthPortfolio';
// Performance imports
import { PerformanceMetrics } from './displays/performance/PerformanceMetrics';
import { useHighs } from '../context/HighsContext';
import { useAuth } from '@/context/AuthContext'; // Adjust path if needed
// import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

type DataSource = {
  id: string;
  title: string;
  endpoint: string;
  icon: React.ReactNode;
  type: string;
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
    title: 'Today\'s 52-Week Highs',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <TrendingUp className="h-0 w-0" />,
    type: 'stock-highs',
    section: 'highs'
  }, {
    id: 'dayGainLoss',
    title: 'Last 24H Net Gain/Loss',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <TrendingUp className="h-0 w-0" />,
    type: 'day-gain-loss',
    section: 'highs'
  }, {
    id: 'weekGainLoss',
    title: 'Last 7D Net Gain/Loss',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <TrendingUp className="h-0 w-0" />,
    type: 'week-gain-loss',
    section: 'highs'
  }, {
    id: 'monthGainLoss',
    title: 'Last 30D Net Gain/Loss',
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    icon: <TrendingUp className="h-0 w-0" />,
    type: 'month-gain-loss',
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
  // const [dashboardData, setDashboardData] = useState<Record<string, any>>({})
  const [dataLoaded, setDataLoaded] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const navigate = useNavigate();         // ✅ at top level
  const { setDashboardData } = useHighs(); // ✅ use context
  const { logout } = useAuth(); // ⬅️ Grab logout action from context
  const navigate = useNavigate();
  const [lastPullTime, setLastPullTime] = useState<string | null>(null);

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

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  const load500Data = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://dashboard-server-prod.vercel.app/api/initiate-oauth');
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
        const accessRes = await fetch('https://dashboard-server-prod.vercel.app/api/execute-oauth', {
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

  const processDashboardData = (response: any) => {
    const highs = response.highs || [];
    const toNum = (val: any) => parseFloat(val) || 0;

    const now = Date.now();
    const todayStr = new Date().toISOString().split("T")[0];
    const yesterdayStr = new Date(now - 86400000).toISOString().split("T")[0];

    // Grouped highs
    const todayshighs = highs.filter((h: { created_at: string; }) => h.created_at?.startsWith(todayStr));
    const yesterdayshighs = highs.filter((h: { created_at: string; }) => h.created_at?.startsWith(yesterdayStr));

    // Past 24H
    const past24H = highs.filter((h: { created_at: string | number | Date; }) => {
      const created = new Date(h.created_at).getTime();
      return now - created <= 86400000;
    });
    // const past24Hpercentage = Math.round(
    //   (past24H.filter((h: { symbol: unknown; }) => todaySymbols.has(h.symbol)).length / (past24H.length || 1)) * 100
    // );
    const past24Hpercentage = (() => {
      const yesterdaySymbols = new Set(yesterdayshighs.map((h: { symbol: any; }) => h.symbol));

      // Match symbols that are in both yesterday and today
      const matched = todayshighs.filter((h: { symbol: unknown; }) => yesterdaySymbols.has(h.symbol));

      if (matched.length === 0) return 0;

      // Calculate percentage change from yesterday to today
      const netChangeSum = matched.reduce((acc: number, todayStock: { symbol: any; price: any; }) => {
        const yesterdayStock = yesterdayshighs.find((y: { symbol: any; }) => y.symbol === todayStock.symbol);
        if (!yesterdayStock) return acc;

        const todayPrice = toNum(todayStock.price);
        const yesterdayPrice = toNum(yesterdayStock.price);
        if (yesterdayPrice === 0) return acc;

        const change = ((todayPrice - yesterdayPrice) / yesterdayPrice) * 100;
        return acc + change;
      }, 0);

      return Math.round(netChangeSum / matched.length);
    })();

    const symbolGroups = new Map<string, { created_at: string; price: number }[]>();

    // Group highs by symbol
    for (const h of highs) {
      if (!symbolGroups.has(h.symbol)) {
        symbolGroups.set(h.symbol, []);
      }
      symbolGroups.get(h.symbol)?.push(h);
    }

    // Track all 24h percentage changes
    const changes: number[] = [];

    for (const [, entries] of symbolGroups.entries()) {
      // Sort by timestamp ascending
      const sorted = entries.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];

        const timeDiff = new Date(curr.created_at).getTime() - new Date(prev.created_at).getTime();

        // Only consider if ~1 day apart (within +/- 2 hours tolerance)
        if (timeDiff >= 22 * 3600000 && timeDiff <= 26 * 3600000) {
          const pctChange = ((curr.price - prev.price) / prev.price) * 100;
          changes.push(pctChange);
        }
      }
    }

    const average24H = Math.round(changes.reduce((acc, c) => acc + c, 0) / (changes.length || 1));

    const average24HCount = past24H.length;

    // Past 7D
    const past7D = highs.filter((h: { created_at: string | number | Date; }) => {
      const created = new Date(h.created_at).getTime();
      return now - created <= 7 * 86400000;
    });
    const past7Dpercentage = (() => {
      const past7DSymbolMap = new Map();
      past7D.forEach((h: { symbol: any; }) => {
        if (!past7DSymbolMap.has(h.symbol)) {
          past7DSymbolMap.set(h.symbol, h); // first occurrence in the past 7d
        }
      });

      let totalInitial = 0;
      let totalCurrent = 0;

      todayshighs.forEach((todayStock: { symbol: any; price: any; }) => {
        const match = past7DSymbolMap.get(todayStock.symbol);
        if (match) {
          const initial = toNum(match.price);
          const current = toNum(todayStock.price);
          if (initial > 0) {
            totalInitial += initial;
            totalCurrent += current;
          }
        }
      });

      if (totalInitial === 0) return 0;

      const percentageChange = ((totalCurrent - totalInitial) / totalInitial) * 100;
      return Math.round(percentageChange);
    })();

    // Group highs by symbol
    const symbolGroups7D = new Map<string, { created_at: string; price: number }[]>();

    for (const h of highs) {
      if (!symbolGroups7D.has(h.symbol)) {
        symbolGroups7D.set(h.symbol, []);
      }
      symbolGroups7D.get(h.symbol)?.push(h);
    }

    const changes7D: number[] = [];

    for (const [, entries] of symbolGroups7D.entries()) {
      const sorted = entries.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      for (let i = 0; i < sorted.length - 1; i++) {
        const start = sorted[i];

        for (let j = i + 1; j < sorted.length; j++) {
          const end = sorted[j];

          const timeDiff = new Date(end.created_at).getTime() - new Date(start.created_at).getTime();

          // Only consider if ~7 days apart (±12h buffer)
          if (timeDiff >= 6.5 * 86400000 && timeDiff <= 7.5 * 86400000) {
            const pctChange = ((end.price - start.price) / start.price) * 100;
            changes7D.push(pctChange);
            break; // Only compare one valid 7d pair per entry
          }
        }
      }
    }

    const average7D = Math.round(changes7D.reduce((acc, c) => acc + c, 0) / (changes7D.length || 1));
    const average7DCount = past7D.length;

    // Past 30D
    const past30D = highs.filter((h: { created_at: string | number | Date; }) => {
      const created = new Date(h.created_at).getTime();
      return now - created <= 30 * 86400000;
    });
    const past30Dpercentage = (() => {
      const past30DSymbolMap = new Map();
      past30D.forEach((h: { symbol: any; }) => {
        if (!past30DSymbolMap.has(h.symbol)) {
          past30DSymbolMap.set(h.symbol, h); // only first occurrence per symbol
        }
      });

      let totalInitial = 0;
      let totalCurrent = 0;

      todayshighs.forEach((todayStock: { symbol: any; price: any; }) => {
        const match = past30DSymbolMap.get(todayStock.symbol);
        if (match) {
          const initial = toNum(match.price);
          const current = toNum(todayStock.price);
          if (initial > 0) {
            totalInitial += initial;
            totalCurrent += current;
          }
        }
      });

      if (totalInitial === 0) return 0;

      const percentageChange = ((totalCurrent - totalInitial) / totalInitial) * 100;
      return Math.round(percentageChange);
    })();

    // Group highs by symbol
    const symbolGroups30D = new Map<string, { created_at: string; price: number }[]>();

    for (const h of highs) {
      if (!symbolGroups30D.has(h.symbol)) {
        symbolGroups30D.set(h.symbol, []);
      }
      symbolGroups30D.get(h.symbol)?.push(h);
    }

    const changes30D: number[] = [];

    for (const [, entries] of symbolGroups30D.entries()) {
      const sorted = entries.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      for (let i = 0; i < sorted.length - 1; i++) {
        const start = sorted[i];

        for (let j = i + 1; j < sorted.length; j++) {
          const end = sorted[j];

          const timeDiff = new Date(end.created_at).getTime() - new Date(start.created_at).getTime();

          // Only consider if ~30 days apart (±1 day buffer)
          if (timeDiff >= 29 * 86400000 && timeDiff <= 31 * 86400000) {
            const pctChange = ((end.price - start.price) / start.price) * 100;
            changes30D.push(pctChange);
            break; // Only one 30d pair per entry
          }
        }
      }
    }

    const average30D = Math.round(changes30D.reduce((acc, c) => acc + c, 0) / (changes30D.length || 1));
    const average30DCount = past30D.length;

    return {
      todayshighs,
      yesterdayshighs,
      past24H,
      past24Hpercentage,
      average24H,
      average24HCount,
      past7D,
      past7Dpercentage,
      average7D,
      average7DCount,
      past30D,
      past30Dpercentage,
      average30D,
      average30DCount
    };
  };

  const findHighs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://dashboard-server-prod.vercel.app/api/fetch-sp500-quotes');
      const data = await res.json();
      console.log('✅ findHighs response:', data);

      if (data) {
        const structuredData = processDashboardData(data);
        console.log('structuredData', structuredData);

        setDashboardData(structuredData); // ✅ store in context
        setDataLoaded(true);
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
  //     const res = await fetch('https://dashboard-server-prod.vercel.app/api/initiate-oauth');
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
  //       const accessRes = await fetch('https://dashboard-server-prod.vercel.app/api/execute-oauth', {
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

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('OAuth session parsing failed:', error.message);
        return;
      }

      const session = data?.session;
      if (!session?.user) return;

      setIsLoading(true);

      try {
        const res = await fetch('https://dashboard-server-prod.vercel.app/api/get-historical-data');
        if (!res.ok) throw new Error(`Failed to fetch historical data (${res.status})`);

        const json = await res.json();
        console.log('get-historical-data result:', json);

        const highs = json.highs || [];
        const latest = highs[0]; // assuming it's ordered by newest first

        if (latest?.created_at) {
          const lastCreated = new Date(latest.created_at);
          const now = new Date();
          const hoursOld = (now.getTime() - lastCreated.getTime()) / (1000 * 60 * 60);

          if (hoursOld > 24) {
            console.log('⏰ Data is stale — fetching fresh quotes...');
            const freshRes = await fetch('https://dashboard-server-prod.vercel.app/api/fetch-sp500-quotes');
            const freshJson = await freshRes.json();
            console.log('✅ findHighs response:', freshJson);

            const structured = processDashboardData(freshJson);
            setDashboardData(structured);
            setDataLoaded(true);
          } else {
            console.log('✅ Data is fresh — using existing quotes');
            const structured = processDashboardData(json);
            console.log('handleoAuthRedirect structured', structured)
            setDashboardData(structured);
            setDataLoaded(true);
          }
        }
      } catch (err) {
        console.error('❌ Error during dashboard load:', err);
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthRedirect();
  }, []);

  const handleLogout = async () => {
    await logout(); // perform sign out
    navigate('/'); // redirect here
  };
  useEffect(() => {
    const fetchLastPullTime = async () => {
      try {
        const res = await fetch('https://dashboard-server-prod.vercel.app/api/set-pull-time', {
          method: 'POST',
        });
        const json = await res.json();
        if (json.formatted) {
          setLastPullTime(json.formatted);
          console.log('fetchlastpulltime json formatted', json.formatted)
        }
      } catch (err) {
        console.error('Failed to fetch pull time:', err);
      }
    };

    fetchLastPullTime();
  }, []);


  return <div className="w-full">
    {!dataLoaded && !isLoading && <EmptyState isAuthenticated={isAuthenticated} findHighs={findHighs} onLoadData={loadDashboardData} onLoadData500={load500Data} theme={theme} toggleTheme={toggleTheme} />}
    {dataLoaded && !isLoading && <>
      <header className="border-b">
        <div className="container mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between relative">
            <button onClick={() => setDataLoaded(false)} className="p-2 hover:bg-muted rounded-md transition-colors" aria-label="Go back">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-md transition-colors text-sm font-medium"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5 rotate-180" />
                Logout
              </button>
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
                {lastPullTime}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${sectionsVisible.highs ? '' : '-rotate-90'}`} />
            </div>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 transition-all duration-200 ${sectionsVisible.highs ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            {dataSources.filter(source => source.section === 'highs').map(source => <DashboardCard
              key={source.id}
              title={source.title}
              icon={source.icon}
              type={source.type as DashboardCardProps['type']}
            />)}            
          </div>
        </div>
        {/* Performance Section */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between border-b pb-2 cursor-pointer select-none" onClick={() => toggleSection('performance')}>
            <h2 className="text-lg font-semibold">Performance</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {lastPullTime}
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
                {lastPullTime}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${sectionsVisible.economic ? '' : '-rotate-90'}`} />
            </div>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 transition-all duration-200 ${sectionsVisible.economic ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            {dataSources.filter(source => source.section === 'economic').map(source => <DashboardCard
              key={source.id}
              title={source.title}
              icon={source.icon}
              type={source.type as DashboardCardProps['type']}
            />)}         
          </div>
        </div>
        {/* Portfolio Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2 cursor-pointer select-none" onClick={() => toggleSection('portfolio')}>
            <h2 className="text-lg font-semibold">Portfolio</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {lastPullTime}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${sectionsVisible.portfolio ? '' : '-rotate-90'}`} />
            </div>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 transition-all duration-200 ${sectionsVisible.portfolio ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            {dataSources.filter(source => source.section === 'portfolio').map(source => <DashboardCard
              key={source.id}
              title={source.title}
              icon={source.icon}
              type={source.type as DashboardCardProps['type']}
            />)}
          </div>
        </div>
      </main>
    </>}
    {isLoading && <div className="flex justify-center items-center py-20">
      <LoadingSpinner />
    </div>}
  </div>;
}
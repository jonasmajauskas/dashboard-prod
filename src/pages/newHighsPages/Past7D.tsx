import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useHighs } from '../../context/HighsContext';


export function Past7D() {
  const navigate = useNavigate();
  const [searchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIndustry] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'growth'>('growth');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 20;
  const { dashboardData } = useHighs();

  const allStocks = useMemo(() => {
    if (!dashboardData?.past7D) return [];
    return dashboardData.past7D.map((stock: any) => ({
      symbol: stock.symbol,
      name: stock.companyName || stock.name || stock.symbol,
      price: parseFloat(stock.price),
      high52Week: parseFloat(stock.price) * 1.01,
      dayGrowth: 0, // Not used in UI
      industry: 'Tech',
    }));
  }, [dashboardData]);

  const filteredStocks = allStocks.filter((stock: { symbol: string; name: string; industry: string; }) => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry ? stock.industry === selectedIndustry : true;
    return matchesSearch && matchesIndustry;
  });

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    if (sortBy === 'symbol') return sortOrder === 'asc' ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
    if (sortBy === 'price') return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    return 0;
  });

  const totalPages = Math.ceil(sortedStocks.length / itemsPerPage);
  const currentStocks = sortedStocks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (field: 'symbol' | 'price' | 'growth') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedIndustry, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <header className="border-b">
          <div className="container mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between relative">
              <button onClick={() => navigate('/')} className="p-2 hover:bg-muted rounded-md transition-colors" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold">Past 7 Days</h1>
              <div className="flex items-center">
                <span className="font-medium md:block hidden">
                  {allStocks.length} Stocks
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 flex justify-end">
          <p className="text-sm text-muted-foreground py-2">
            {allStocks.length} Stocks Found
          </p>
        </div>

        {/* <div className="container mx-auto px-4">
          <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Search by symbol or name..." className="w-full pl-10 pr-4 py-2 rounded-md border bg-background" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex-grow md:flex-grow-0">
                <select className="w-full md:w-auto px-4 py-2 rounded-md border bg-background" value={selectedIndustry || ''} onChange={e => setSelectedIndustry(e.target.value || null)}>
                  <option value="">All Industries</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div> */}

        <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium">
            <div className="col-span-9 md:col-span-9">Symbol & Name</div>
            <div
              className="col-span-3 md:col-span-3 text-right cursor-pointer"
              onClick={() => toggleSort('price')}
            >
              Price
              <span className={`ml-1 ${sortBy === 'price' ? 'opacity-100' : 'opacity-0'}`}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            </div>
          </div>

          <div className="divide-y">
            {currentStocks.length > 0 ? currentStocks.map(stock => (
              <div
                key={stock.symbol}
                className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 cursor-pointer items-center"
                onClick={() => navigate('/stock-analysis')}
              >
                <div className="col-span-9 md:col-span-9">
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-muted-foreground text-sm">{stock.name}</div>
                </div>
                <div className="col-span-3 md:col-span-3 text-right font-semibold">
                  ${stock.price.toFixed(2)}
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground">No stocks match your search criteria</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredStocks.length)} of{' '}
                {filteredStocks.length} results
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded border disabled:opacity-50" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button>
                <button className="px-3 py-1 rounded border disabled:opacity-50" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

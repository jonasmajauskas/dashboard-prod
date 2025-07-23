import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import LoginPage from './pages/LoginPage'; // ✅ Correct
import { DetailedStockView } from './pages/DetailedStockView';
import { TradeForm } from './pages/TradeForm';
import { TradeConfirmation } from './pages/TradeConfirmation';
import { BulkTradeForm } from './pages/BulkTradeForm';
import { BulkTradeConfirmation } from './pages/BulkTradeConfirmation';
import { AllNewHighs } from './pages/newHighsPages/AllNewHighs';
import { Past24H } from './pages/newHighsPages/Past24H';
import { Past7D } from './pages/newHighsPages/Past7D';
import { Past30D } from './pages/newHighsPages/Past30D';
import { OpenPositions } from './pages/OpenPositions';
import { PastPositions } from './pages/PastPositions';
import { IncomePortfolioView } from './pages/IncomePortfolioView';
import { GrowthPortfolioView } from './pages/GrowthPortfolioView';
import { HighsProvider } from './context/HighsContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function ProtectedRoute({ element }: { element: JSX.Element }) {
  const { user } = useAuth();
  return user ? element : <Navigate to="/" replace />;
}

export function App() {
  return (
    <AuthProvider>
    <HighsProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/stock-analysis" element={<ProtectedRoute element={<DetailedStockView />} />} />
              <Route path="/trade" element={<ProtectedRoute element={<TradeForm />} />} />
              <Route path="/trade-confirmation" element={<ProtectedRoute element={<TradeConfirmation />} />} />
              <Route path="/bulk-trade" element={<ProtectedRoute element={<BulkTradeForm />} />} />
              <Route path="/bulk-trade-confirmation" element={<ProtectedRoute element={<BulkTradeConfirmation />} />} />
              <Route path="/all-new-highs" element={<ProtectedRoute element={<AllNewHighs />} />} />
              <Route path="/past24h" element={<ProtectedRoute element={<Past24H />} />} />
              <Route path="/past7d" element={<ProtectedRoute element={<Past7D />} />} />
              <Route path="/past30d" element={<ProtectedRoute element={<Past30D />} />} />
              <Route path="/open-positions" element={<ProtectedRoute element={<OpenPositions />} />} />
              <Route path="/past-positions" element={<ProtectedRoute element={<PastPositions />} />} />
              <Route path="/income-portfolio" element={<ProtectedRoute element={<IncomePortfolioView />} />} />
              <Route path="/growth-portfolio" element={<ProtectedRoute element={<GrowthPortfolioView />} />} />
            </Routes>
        </div>
      </BrowserRouter>
    </HighsProvider>
    </AuthProvider>
  );
}
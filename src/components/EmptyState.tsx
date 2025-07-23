import React from 'react';
import { DatabaseIcon, Moon, Sun } from 'lucide-react';

interface EmptyStateProps {
  onLoadData: () => void;
  onLoadData500: () => void;
  findHighs: () => void;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function EmptyState({
  onLoadData,
  onLoadData500,
  findHighs,
  theme,
  toggleTheme,
  isAuthenticated,
}: EmptyStateProps) {
  return (
    <div>
      <header className="border-b">
        <div className="container mx-auto p-4 md:p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-medium">Financial Dashboard</h1>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <DatabaseIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          No data to display
        </h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Your dashboard is ready, but there's no data to show yet. Click the
          button below to fetch data from endpoints.
        </p>
        {/* <button
          onClick={onLoadData}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Load Simulated Data
        </button> */}
        {!isAuthenticated ? (
          <button
            onClick={onLoadData500}
            className="px-6 py-3 mt-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Authenticate
          </button>
        ) : (
          <button
            onClick={findHighs}
            className="px-6 py-3 mt-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Find Highs
          </button>
        )}
      </div>
    </div>
  );
}
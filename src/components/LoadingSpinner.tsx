import React from 'react';
export function LoadingSpinner() {
  return <div className="flex flex-col items-center">
      <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-muted-foreground text-sm">Loading data...</p>
    </div>;
}
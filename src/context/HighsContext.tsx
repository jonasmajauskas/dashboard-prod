import React, { createContext, useState, useContext } from 'react';

export const HighsContext = createContext<any>(null);

export const HighsProvider = ({ children }: { children: React.ReactNode }) => {
  const [dashboardData, setDashboardData] = useState({});

  return (
    <HighsContext.Provider value={{ dashboardData, setDashboardData }}>
      {children}
    </HighsContext.Provider>
  );
};

export const useHighs = () => useContext(HighsContext);
// StockContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface StockContextType {
  stockData: any;
  setStockData: (data: any) => void;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stockData, setStockData] = useState<any>(null);

  return (
    <StockContext.Provider value={{ stockData, setStockData }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStockContext = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStockContext must be used within a StockProvider');
  }
  return context;
};
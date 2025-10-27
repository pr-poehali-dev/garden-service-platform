import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface OrderRequest {
  id: string;
  name: string;
  address: string;
  phone: string;
  messenger?: string;
  comment?: string;
  services: Array<{
    name: string;
    category: string;
    price: number;
    unit: string;
    quantity: number;
    totalPrice: number;
  }>;
  totalPrice: number;
  status: 'new' | 'processing' | 'completed';
  date: string;
}

interface OrderRequestContextType {
  requests: OrderRequest[];
  addRequest: (request: Omit<OrderRequest, 'id' | 'date' | 'status'>) => void;
  updateStatus: (id: string, status: OrderRequest['status']) => void;
  deleteRequest: (id: string) => void;
}

const OrderRequestContext = createContext<OrderRequestContextType | undefined>(undefined);

const STORAGE_KEY = 'order_requests';

export const OrderRequestProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<OrderRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  const addRequest = (request: Omit<OrderRequest, 'id' | 'date' | 'status'>) => {
    const newRequest: OrderRequest = {
      ...request,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'new'
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const updateStatus = (id: string, status: OrderRequest['status']) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status } : req
    ));
  };

  const deleteRequest = (id: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <OrderRequestContext.Provider value={{ requests, addRequest, updateStatus, deleteRequest }}>
      {children}
    </OrderRequestContext.Provider>
  );
};

export const useOrderRequests = () => {
  const context = useContext(OrderRequestContext);
  if (!context) {
    throw new Error('useOrderRequests must be used within OrderRequestProvider');
  }
  return context;
};
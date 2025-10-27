import { createContext, useContext, useState, ReactNode } from 'react';

interface OrderItem {
  id: string;
  category: string;
  name: string;
  price: number;
  unit?: string;
  quantity: number;
  totalPrice: number;
}

interface OrderContextType {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearOrder: () => void;
  getTotalPrice: () => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<OrderItem[]>([]);

  const addItem = (item: OrderItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearOrder = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  return (
    <OrderContext.Provider value={{ items, addItem, removeItem, clearOrder, getTotalPrice }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
};
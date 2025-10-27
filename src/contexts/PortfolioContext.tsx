import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface PortfolioPost {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
}

interface PortfolioContextType {
  posts: PortfolioPost[];
  addPost: (post: Omit<PortfolioPost, 'id' | 'date'>) => void;
  updatePost: (id: string, post: Partial<PortfolioPost>) => void;
  deletePost: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio_posts';

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<PortfolioPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const addPost = (post: Omit<PortfolioPost, 'id' | 'date'>) => {
    const newPost: PortfolioPost = {
      ...post,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const updatePost = (id: string, updates: Partial<PortfolioPost>) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, ...updates } : post
    ));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  return (
    <PortfolioContext.Provider value={{ posts, addPost, updatePost, deletePost }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
};

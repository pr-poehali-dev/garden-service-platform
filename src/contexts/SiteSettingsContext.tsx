import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  socials: {
    instagram?: string;
    telegram?: string;
    youtube?: string;
    whatsapp?: string;
  };
}

interface SiteSettingsContextType {
  contacts: ContactInfo;
  updateContacts: (contacts: ContactInfo) => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'site_settings';

const defaultContacts: ContactInfo = {
  phone: '+7 (495) 123-45-67',
  email: 'hello@agency.ru',
  address: 'г. Москва, ул. Тверская, 12',
  socials: {
    instagram: '#',
    telegram: '#',
    youtube: '#',
    whatsapp: '#'
  }
};

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultContacts;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const updateContacts = (newContacts: ContactInfo) => {
    setContacts(newContacts);
  };

  return (
    <SiteSettingsContext.Provider value={{ contacts, updateContacts }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  }
  return context;
};
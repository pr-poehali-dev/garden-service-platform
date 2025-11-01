import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import FUNC_URLS from '../../backend/func2url.json';

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

export interface SiteSettings {
  site_name?: string;
  site_description?: string;
  logo?: string;
  logo_size?: number;
  site_name_size?: number;
  footer_logo?: string;
  footer_logo_size?: number;
  footer_site_name?: string;
  footer_site_name_size?: number;
  footer_description?: string;
  footer_description_size?: number;
  copyright_text?: string;
  copyright_text_size?: number;
  favicon?: string;
  meta_title?: string;
  meta_description?: string;
  colors?: Record<string, string>;
  custom_settings?: Record<string, any>;
}

interface SiteSettingsContextType {
  contacts: ContactInfo;
  settings: SiteSettings;
  updateContacts: (contacts: ContactInfo) => Promise<void>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

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

const defaultSettings: SiteSettings = {
  site_name: 'Мой сайт',
  logo_size: 40,
  site_name_size: 24,
  footer_logo_size: 40,
  footer_site_name_size: 20,
  footer_description_size: 14,
  copyright_text_size: 12,
  meta_title: 'Главная страница',
  colors: {},
  custom_settings: {}
};

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<ContactInfo>(defaultContacts);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await fetch(FUNC_URLS.settings);
      if (response.ok) {
        const data = await response.json();
        
        if (data.siteSettings) {
          setSettings(data.siteSettings);
        }
        
        if (data.contacts) {
          const contactsData = data.contacts;
          setContacts({
            phone: contactsData.phones?.[0] || defaultContacts.phone,
            email: contactsData.email || defaultContacts.email,
            address: contactsData.address || defaultContacts.address,
            socials: {
              instagram: contactsData.socials?.instagram || '#',
              telegram: contactsData.messengers?.telegram || '#',
              youtube: contactsData.socials?.youtube || '#',
              whatsapp: contactsData.messengers?.whatsapp || '#'
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateContacts = async (newContacts: ContactInfo) => {
    try {
      const response = await fetch(FUNC_URLS.settings, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: 'contacts',
          data: {
            phones: [newContacts.phone],
            address: newContacts.address,
            messengers: {
              telegram: newContacts.socials.telegram,
              whatsapp: newContacts.socials.whatsapp
            },
            socials: {
              instagram: newContacts.socials.instagram,
              youtube: newContacts.socials.youtube
            }
          }
        })
      });

      if (response.ok) {
        setContacts(newContacts);
      }
    } catch (error) {
      console.error('Failed to update contacts:', error);
      throw error;
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const response = await fetch(FUNC_URLS.settings, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: 'siteSettings',
          data: newSettings
        })
      });

      if (response.ok) {
        setSettings(prev => ({ ...prev, ...newSettings }));
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  const refresh = async () => {
    setIsLoading(true);
    await fetchSettings();
  };

  return (
    <SiteSettingsContext.Provider value={{ 
      contacts, 
      settings, 
      updateContacts, 
      updateSettings, 
      isLoading,
      refresh 
    }}>
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

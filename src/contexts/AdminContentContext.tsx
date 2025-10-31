import { createContext, useContext, useState, ReactNode } from 'react';

export interface ContentService {
  id: number;
  title: string;
  slug: string;
  short_desc?: string;
  description?: string;
  price?: number;
  unit?: string;
  visible: boolean;
  sort_order: number;
  images: string[];
  meta_title?: string;
  meta_description?: string;
  removed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContentPost {
  id: number;
  title: string;
  slug: string;
  published_at?: string;
  excerpt?: string;
  body?: string;
  gallery: string[];
  visible: boolean;
  meta_title?: string;
  meta_description?: string;
  removed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContentTeamMember {
  id: number;
  name: string;
  role: string;
  photo: string;
  phone?: string;
  telegram?: string;
  visible: boolean;
  sort_order: number;
  removed_at?: string;
  created_at?: string;
}

export interface ContactPage {
  id: number;
  phones: string[];
  messengers: {
    whatsapp?: string;
    telegram?: string;
    viber?: string;
  };
  address?: string;
  map_embed?: string;
  socials: {
    vk?: string;
    instagram?: string;
    facebook?: string;
  };
  requisites: {
    inn?: string;
    ogrn?: string;
    legal_address?: string;
    bank_details?: string;
  };
  updated_at?: string;
}

export interface Homepage {
  id: number;
  site_name?: string;
  logo?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_bg?: string;
  blocks: Array<{
    type: string;
    content: Record<string, unknown>;
  }>;
  meta_title?: string;
  meta_description?: string;
  updated_at?: string;
}

interface AdminContentContextType {
  services: ContentService[];
  posts: ContentPost[];
  teamMembers: ContentTeamMember[];
  contactPage: ContactPage | null;
  homepage: Homepage | null;
  loading: boolean;
  error: string | null;
  
  fetchServices: (includeHidden?: boolean) => Promise<void>;
  getService: (id: number) => ContentService | undefined;
  createService: (service: Omit<ContentService, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateService: (id: number, updates: Partial<ContentService>) => Promise<void>;
  toggleServiceVisibility: (id: number) => Promise<void>;
  softRemoveService: (id: number) => Promise<void>;
  restoreService: (id: number) => Promise<void>;
  
  fetchPosts: (includeHidden?: boolean) => Promise<void>;
  getPost: (id: number) => ContentPost | undefined;
  createPost: (post: Omit<ContentPost, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePost: (id: number, updates: Partial<ContentPost>) => Promise<void>;
  togglePostVisibility: (id: number) => Promise<void>;
  softRemovePost: (id: number) => Promise<void>;
  restorePost: (id: number) => Promise<void>;
  
  fetchTeamMembers: (includeHidden?: boolean) => Promise<void>;
  getTeamMember: (id: number) => ContentTeamMember | undefined;
  createTeamMember: (member: Omit<ContentTeamMember, 'id' | 'created_at'>) => Promise<void>;
  updateTeamMember: (id: number, updates: Partial<ContentTeamMember>) => Promise<void>;
  toggleTeamMemberVisibility: (id: number) => Promise<void>;
  softRemoveTeamMember: (id: number) => Promise<void>;
  restoreTeamMember: (id: number) => Promise<void>;
  
  fetchContactPage: () => Promise<void>;
  updateContactPage: (updates: Partial<ContactPage>) => Promise<void>;
  
  fetchHomepage: () => Promise<void>;
  updateHomepage: (updates: Partial<Homepage>) => Promise<void>;
}

const AdminContentContext = createContext<AdminContentContextType | undefined>(undefined);

export const useAdminContent = () => {
  const context = useContext(AdminContentContext);
  if (!context) {
    throw new Error('useAdminContent must be used within AdminContentProvider');
  }
  return context;
};

export const AdminContentProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<ContentService[]>([]);
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [teamMembers, setTeamMembers] = useState<ContentTeamMember[]>([]);
  const [contactPage, setContactPage] = useState<ContactPage | null>(null);
  const [homepage, setHomepage] = useState<Homepage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async (includeHidden = false) => {
    setLoading(true);
    setError(null);
    try {
      const mockServices: ContentService[] = [
        {
          id: 1,
          title: 'Обрезка деревьев',
          slug: 'tree-pruning',
          short_desc: 'Профессиональная обрезка плодовых и декоративных деревьев',
          description: 'Комплексная обрезка деревьев включает санитарную, формовочную и омолаживающую обрезку. Обеспечиваем здоровье и красоту ваших деревьев.',
          price: 2000,
          unit: 'дерево',
          visible: true,
          sort_order: 1,
          images: [],
          meta_title: 'Обрезка деревьев - профессиональные услуги',
          meta_description: 'Закажите обрезку деревьев у профессионалов. Санитарная, формовочная и омолаживающая обрезка.'
        },
        {
          id: 2,
          title: 'Уход за газоном',
          slug: 'lawn-care',
          short_desc: 'Стрижка, аэрация, подкормка газона',
          description: 'Полный комплекс услуг по уходу за газоном для идеального вида вашего участка круглый год.',
          price: 500,
          unit: 'сотка',
          visible: true,
          sort_order: 2,
          images: [],
          meta_title: 'Уход за газоном - профессиональные услуги',
          meta_description: 'Профессиональный уход за газоном на вашем участке. Стрижка, аэрация, подкормка.'
        }
      ];
      
      setServices(includeHidden ? mockServices : mockServices.filter(s => s.visible && !s.removed_at));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки услуг');
    } finally {
      setLoading(false);
    }
  };

  const getService = (id: number) => services.find(s => s.id === id);

  const createService = async (service: Omit<ContentService, 'id' | 'created_at' | 'updated_at'>) => {
    const newService: ContentService = {
      ...service,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = async (id: number, updates: Partial<ContentService>) => {
    setServices(prev => prev.map(s => 
      s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s
    ));
  };

  const toggleServiceVisibility = async (id: number) => {
    const service = services.find(s => s.id === id);
    if (service) {
      await updateService(id, { visible: !service.visible });
    }
  };

  const softRemoveService = async (id: number) => {
    await updateService(id, { removed_at: new Date().toISOString() });
  };

  const restoreService = async (id: number) => {
    await updateService(id, { removed_at: undefined });
  };

  const fetchPosts = async (includeHidden = false) => {
    setLoading(true);
    setError(null);
    try {
      const mockPosts: ContentPost[] = [];
      setPosts(includeHidden ? mockPosts : mockPosts.filter(p => p.visible && !p.removed_at));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки постов');
    } finally {
      setLoading(false);
    }
  };

  const getPost = (id: number) => posts.find(p => p.id === id);

  const createPost = async (post: Omit<ContentPost, 'id' | 'created_at' | 'updated_at'>) => {
    const newPost: ContentPost = {
      ...post,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setPosts(prev => [...prev, newPost]);
  };

  const updatePost = async (id: number, updates: Partial<ContentPost>) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
    ));
  };

  const togglePostVisibility = async (id: number) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      await updatePost(id, { visible: !post.visible });
    }
  };

  const softRemovePost = async (id: number) => {
    await updatePost(id, { removed_at: new Date().toISOString() });
  };

  const restorePost = async (id: number) => {
    await updatePost(id, { removed_at: undefined });
  };

  const fetchTeamMembers = async (includeHidden = false) => {
    setLoading(true);
    setError(null);
    try {
      const mockTeam: ContentTeamMember[] = [
        {
          id: 1,
          name: 'Мелихов Никита',
          role: 'Руководитель',
          photo: 'https://i.pravatar.cc/400?img=12',
          visible: true,
          sort_order: 1
        },
        {
          id: 2,
          name: 'Гвасалия Фредо',
          role: 'Главный агроном',
          photo: 'https://i.pravatar.cc/400?img=33',
          visible: true,
          sort_order: 2
        }
      ];
      setTeamMembers(includeHidden ? mockTeam : mockTeam.filter(m => m.visible && !m.removed_at));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки команды');
    } finally {
      setLoading(false);
    }
  };

  const getTeamMember = (id: number) => teamMembers.find(m => m.id === id);

  const createTeamMember = async (member: Omit<ContentTeamMember, 'id' | 'created_at'>) => {
    const newMember: ContentTeamMember = {
      ...member,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const updateTeamMember = async (id: number, updates: Partial<ContentTeamMember>) => {
    setTeamMembers(prev => prev.map(m => 
      m.id === id ? { ...m, ...updates } : m
    ));
  };

  const toggleTeamMemberVisibility = async (id: number) => {
    const member = teamMembers.find(m => m.id === id);
    if (member) {
      await updateTeamMember(id, { visible: !member.visible });
    }
  };

  const softRemoveTeamMember = async (id: number) => {
    await updateTeamMember(id, { removed_at: new Date().toISOString() });
  };

  const restoreTeamMember = async (id: number) => {
    await updateTeamMember(id, { removed_at: undefined });
  };

  const fetchContactPage = async () => {
    setLoading(true);
    setError(null);
    try {
      const savedContact = localStorage.getItem('admin_contact_page');
      const mockContact: ContactPage = savedContact ? JSON.parse(savedContact) : {
        id: 1,
        phones: ['+7 (999) 123-45-67'],
        messengers: {
          whatsapp: '+79991234567',
          telegram: '@garden_service'
        },
        address: 'Москва, ул. Примерная, д. 1',
        socials: {},
        requisites: {}
      };
      setContactPage(mockContact);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки контактов');
    } finally {
      setLoading(false);
    }
  };

  const updateContactPage = async (updates: Partial<ContactPage>) => {
    const updated = contactPage ? { ...contactPage, ...updates, updated_at: new Date().toISOString() } : null;
    setContactPage(updated);
    if (updated) {
      localStorage.setItem('admin_contact_page', JSON.stringify(updated));
    }
  };

  const fetchHomepage = async () => {
    setLoading(true);
    setError(null);
    try {
      const savedHome = localStorage.getItem('admin_homepage');
      const mockHome: Homepage = savedHome ? JSON.parse(savedHome) : {
        id: 1,
        site_name: 'Садовый Сервис',
        hero_title: 'Профессиональный уход за садом',
        hero_subtitle: 'Более 10 лет заботимся о вашем участке',
        blocks: []
      };
      setHomepage(mockHome);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки главной');
    } finally {
      setLoading(false);
    }
  };

  const updateHomepage = async (updates: Partial<Homepage>) => {
    const updated = homepage ? { ...homepage, ...updates, updated_at: new Date().toISOString() } : null;
    setHomepage(updated);
    if (updated) {
      localStorage.setItem('admin_homepage', JSON.stringify(updated));
    }
  };

  return (
    <AdminContentContext.Provider
      value={{
        services,
        posts,
        teamMembers,
        contactPage,
        homepage,
        loading,
        error,
        fetchServices,
        getService,
        createService,
        updateService,
        toggleServiceVisibility,
        softRemoveService,
        restoreService,
        fetchPosts,
        getPost,
        createPost,
        updatePost,
        togglePostVisibility,
        softRemovePost,
        restorePost,
        fetchTeamMembers,
        getTeamMember,
        createTeamMember,
        updateTeamMember,
        toggleTeamMemberVisibility,
        softRemoveTeamMember,
        restoreTeamMember,
        fetchContactPage,
        updateContactPage,
        fetchHomepage,
        updateHomepage
      }}
    >
      {children}
    </AdminContentContext.Provider>
  );
};
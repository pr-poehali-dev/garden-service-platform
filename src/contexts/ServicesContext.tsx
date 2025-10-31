import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Service {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export interface CategoryData {
  title: string;
  description: string;
  icon: string;
  services: Service[];
  visible?: boolean;
}

export type CategoriesData = Record<string, CategoryData>;

interface ServicesContextType {
  categories: CategoriesData;
  updateService: (categorySlug: string, serviceId: string, updates: Partial<Service>) => void;
  addService: (categorySlug: string, service: Service) => void;
  deleteService: (categorySlug: string, serviceId: string) => void;
  updateCategory: (categorySlug: string, updates: Partial<Omit<CategoryData, 'services'>>) => void;
  addCategory: (categorySlug: string, category: CategoryData) => void;
  deleteCategory: (categorySlug: string) => void;
  toggleCategoryVisibility: (categorySlug: string) => void;
  reorderCategories: (slugs: string[], isVisible: boolean) => void;
  reorderServices: (categorySlug: string, serviceIds: string[]) => void;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

const STORAGE_KEY = 'services_data';

const defaultCategories: CategoriesData = {
  "green-care": {
    title: "Уход за зелёными насаждениями",
    description: "Профессиональный уход за деревьями и кустарниками",
    icon: "TreeDeciduous",
    services: [
      { id: "gc1", name: "Санитарная обрезка дерева", price: 1500, unit: "дерево" },
      { id: "gc2", name: "Формирующая обрезка дерева", price: 2000, unit: "дерево" },
      { id: "gc3", name: "Омолаживающая обрезка", price: 2500, unit: "дерево" },
      { id: "gc4", name: "Кронирование дерева", price: 3000, unit: "дерево" },
      { id: "gc5", name: "Топиарная стрижка кустарника", price: 800, unit: "куст" },
      { id: "gc6", name: "Прививка растений", price: 1200, unit: "шт" },
      { id: "gc7", name: "Валка дерева", price: 4000, unit: "дерево" },
      { id: "gc8", name: "Выкорчёвывание пня", price: 2000, unit: "пень" }
    ]
  },
  "treatment": {
    title: "Обработка растений и участка",
    description: "Защита от вредителей и болезней",
    icon: "Bug",
    services: [
      { id: "tr1", name: "Обработка от вредителей", price: 2000, unit: "сотка" },
      { id: "tr2", name: "Обработка от болезней", price: 2000, unit: "сотка" },
      { id: "tr3", name: "Внекорневая подкормка", price: 1500, unit: "сотка" },
      { id: "tr4", name: "Обработка от клещей", price: 2500, unit: "сотка" },
      { id: "tr5", name: "Обработка от комаров", price: 2000, unit: "сотка" },
      { id: "tr6", name: "Борьба с грызунами", price: 3000, unit: "участок" },
      { id: "tr7", name: "Дезинфекция теплицы", price: 1500, unit: "теплица" },
      { id: "tr8", name: "Гербицидная обработка газона", price: 1800, unit: "сотка" }
    ]
  },
  "lawn": {
    title: "Газоны и почва",
    description: "Создание и уход за идеальным газоном",
    icon: "Sprout",
    services: [
      { id: "lw1", name: "Стрижка газона", price: 800, unit: "сотка" },
      { id: "lw2", name: "Устройство посевного газона", price: 5000, unit: "сотка" },
      { id: "lw3", name: "Укладка рулонного газона", price: 12000, unit: "сотка" },
      { id: "lw4", name: "Аэрация газона", price: 1200, unit: "сотка" },
      { id: "lw5", name: "Вертикуляция газона", price: 1500, unit: "сотка" },
      { id: "lw6", name: "Подкормка газона", price: 1000, unit: "сотка" },
      { id: "lw7", name: "Мульчирование почвы", price: 2000, unit: "сотка" },
      { id: "lw8", name: "Ремонт газона", price: 3000, unit: "участок" }
    ]
  },
  "planting": {
    title: "Посадочные работы",
    description: "Посадка деревьев, кустарников и цветов",
    icon: "Flower2",
    services: [
      { id: "pl1", name: "Посадка дерева (до 2м)", price: 1000, unit: "дерево" },
      { id: "pl2", name: "Посадка крупномера", price: 5000, unit: "дерево" },
      { id: "pl3", name: "Посадка кустарника", price: 600, unit: "куст" },
      { id: "pl4", name: "Посадка цветов", price: 300, unit: "м²" },
      { id: "pl5", name: "Посадка рассады", price: 50, unit: "шт" },
      { id: "pl6", name: "Пересадка растений", price: 800, unit: "растение" },
      { id: "pl7", name: "Подготовка клумбы", price: 2000, unit: "клумба" },
      { id: "pl8", name: "Внесение удобрений", price: 1200, unit: "сотка" }
    ]
  },
  "landscape": {
    title: "Благоустройство и ландшафт",
    description: "Создание уникального ландшафта",
    icon: "Home",
    services: [
      { id: "ls1", name: "Ландшафтный проект", price: 15000, unit: "проект" },
      { id: "ls2", name: "Озеленение участка", price: 25000, unit: "комплекс" },
      { id: "ls3", name: "Устройство цветника", price: 8000, unit: "цветник" },
      { id: "ls4", name: "Альпийская горка", price: 20000, unit: "горка" },
      { id: "ls5", name: "Система автополива", price: 30000, unit: "система" },
      { id: "ls6", name: "Ландшафтное освещение", price: 25000, unit: "комплекс" },
      { id: "ls7", name: "Фитодизайн интерьера", price: 10000, unit: "помещение" },
      { id: "ls8", name: "Садовые дорожки", price: 3000, unit: "м²" }
    ]
  },
  "cleaning": {
    title: "Уборка участка",
    description: "Поддержание чистоты и порядка",
    icon: "Trash2",
    services: [
      { id: "cl1", name: "Уборка листвы", price: 1000, unit: "сотка" },
      { id: "cl2", name: "Вывоз мусора", price: 2000, unit: "рейс" },
      { id: "cl3", name: "Удаление сорняков", price: 800, unit: "сотка" },
      { id: "cl4", name: "Чистка водоёма", price: 5000, unit: "водоём" },
      { id: "cl5", name: "Уборка снега", price: 1500, unit: "сотка" },
      { id: "cl6", name: "Скашивание травы", price: 700, unit: "сотка" },
      { id: "cl7", name: "Очистка желобов", price: 1200, unit: "дом" },
      { id: "cl8", name: "Генеральная уборка участка", price: 8000, unit: "участок" }
    ]
  },
  "winter": {
    title: "Зимнее обслуживание",
    description: "Уход за участком в холодное время года",
    icon: "Snowflake",
    services: [
      { id: "wt1", name: "Снегоуборка дорожек", price: 1000, unit: "м²" },
      { id: "wt2", name: "Чистка кровли от снега", price: 3000, unit: "дом" },
      { id: "wt3", name: "Сбивание сосулек", price: 1500, unit: "дом" },
      { id: "wt4", name: "Укрытие растений", price: 500, unit: "растение" },
      { id: "wt5", name: "Посыпка противогололёдной смесью", price: 800, unit: "сотка" },
      { id: "wt6", name: "Обогрев дорожек", price: 25000, unit: "система" },
      { id: "wt7", name: "Защита хвойных от солнца", price: 600, unit: "дерево" },
      { id: "wt8", name: "Подзимний полив", price: 1200, unit: "участок" }
    ]
  },
  "complex": {
    title: "Комплексное обслуживание",
    description: "Годовое обслуживание участка",
    icon: "Calendar",
    services: [
      { id: "cx1", name: "Весенний комплекс", price: 15000, unit: "сезон" },
      { id: "cx2", name: "Летний комплекс", price: 12000, unit: "сезон" },
      { id: "cx3", name: "Осенний комплекс", price: 14000, unit: "сезон" },
      { id: "cx4", name: "Зимний комплекс", price: 10000, unit: "сезон" },
      { id: "cx5", name: "Годовое обслуживание (до 10 соток)", price: 60000, unit: "год" },
      { id: "cx6", name: "Годовое обслуживание (10-20 соток)", price: 90000, unit: "год" },
      { id: "cx7", name: "Годовое обслуживание (более 20 соток)", price: 150000, unit: "год" },
      { id: "cx8", name: "Разовый выезд специалиста", price: 3000, unit: "выезд" }
    ]
  }
};

export const ServicesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<CategoriesData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const updateService = (categorySlug: string, serviceId: string, updates: Partial<Service>) => {
    setCategories(prev => {
      const category = prev[categorySlug];
      if (!category) return prev;

      return {
        ...prev,
        [categorySlug]: {
          ...category,
          services: category.services.map(service =>
            service.id === serviceId ? { ...service, ...updates } : service
          )
        }
      };
    });
  };

  const addService = (categorySlug: string, service: Service) => {
    setCategories(prev => {
      const category = prev[categorySlug];
      if (!category) return prev;

      return {
        ...prev,
        [categorySlug]: {
          ...category,
          services: [...category.services, service]
        }
      };
    });
  };

  const deleteService = (categorySlug: string, serviceId: string) => {
    setCategories(prev => {
      const category = prev[categorySlug];
      if (!category) return prev;

      return {
        ...prev,
        [categorySlug]: {
          ...category,
          services: category.services.filter(service => service.id !== serviceId)
        }
      };
    });
  };

  const updateCategory = (categorySlug: string, updates: Partial<Omit<CategoryData, 'services'>>) => {
    setCategories(prev => {
      const category = prev[categorySlug];
      if (!category) return prev;

      return {
        ...prev,
        [categorySlug]: {
          ...category,
          ...updates
        }
      };
    });
  };

  const addCategory = (categorySlug: string, category: CategoryData) => {
    setCategories(prev => ({
      ...prev,
      [categorySlug]: category
    }));
  };

  const deleteCategory = (categorySlug: string) => {
    setCategories(prev => {
      const newCategories = { ...prev };
      delete newCategories[categorySlug];
      return newCategories;
    });
  };

  const toggleCategoryVisibility = (categorySlug: string) => {
    setCategories(prev => {
      const category = prev[categorySlug];
      if (!category) return prev;

      return {
        ...prev,
        [categorySlug]: {
          ...category,
          visible: category.visible === false ? true : false
        }
      };
    });
  };

  const reorderCategories = (slugs: string[], isVisible: boolean) => {
    setCategories(prev => {
      const entries = Object.entries(prev);
      const visible = entries.filter(([, cat]) => cat.visible !== false);
      const hidden = entries.filter(([, cat]) => cat.visible === false);
      
      let reordered: [string, CategoryData][];
      
      if (isVisible) {
        reordered = [...slugs.map(slug => [slug, prev[slug]] as [string, CategoryData]), ...hidden];
      } else {
        reordered = [...visible, ...slugs.map(slug => [slug, prev[slug]] as [string, CategoryData])];
      }
      
      return Object.fromEntries(reordered);
    });
  };

  const reorderServices = (categorySlug: string, serviceIds: string[]) => {
    setCategories(prev => {
      const category = prev[categorySlug];
      if (!category) return prev;

      const reordered = serviceIds
        .map(id => category.services.find(s => s.id === id))
        .filter((s): s is Service => s !== undefined);

      return {
        ...prev,
        [categorySlug]: {
          ...category,
          services: reordered
        }
      };
    });
  };

  return (
    <ServicesContext.Provider value={{ 
      categories, 
      updateService, 
      addService, 
      deleteService, 
      updateCategory,
      addCategory,
      deleteCategory,
      toggleCategoryVisibility,
      reorderCategories,
      reorderServices
    }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within ServicesProvider');
  }
  return context;
};
const IMAGE_STORAGE_KEY = 'uploaded_images';

export interface StoredImage {
  id: string;
  dataUrl: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

export const imageStorage = {
  save(file: File): Promise<StoredImage> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const image: StoredImage = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          dataUrl,
          filename: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString()
        };

        const stored = this.getAll();
        stored.push(image);
        localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(stored));
        
        resolve(image);
      };

      reader.onerror = () => reject(new Error('Ошибка чтения файла'));
      reader.readAsDataURL(file);
    });
  },

  getAll(): StoredImage[] {
    const stored = localStorage.getItem(IMAGE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getById(id: string): StoredImage | undefined {
    return this.getAll().find(img => img.id === id);
  },

  delete(id: string): void {
    const stored = this.getAll().filter(img => img.id !== id);
    localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(stored));
  },

  getTotalSize(): number {
    return this.getAll().reduce((sum, img) => sum + img.size, 0);
  },

  clear(): void {
    localStorage.removeItem(IMAGE_STORAGE_KEY);
  }
};

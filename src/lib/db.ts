const SCHEMA = 't_p92769154_garden_service_platf';

export interface Service {
  id: number;
  title: string;
  slug: string;
  short_desc?: string;
  description?: string;
  price: number;
  unit?: string;
  visible: boolean;
  sort_order: number;
  images?: string[];
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  removed_at?: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  published_at?: string;
  excerpt?: string;
  body?: string;
  gallery?: string[];
  visible: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  removed_at?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role?: string;
  photo?: string;
  phone?: string;
  telegram?: string;
  visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  removed_at?: string;
}

export interface ContactPage {
  id: number;
  phones?: string[];
  messengers?: { [key: string]: string };
  address?: string;
  map_embed?: string;
  socials?: { [key: string]: string };
  requisites?: { [key: string]: string };
  updated_at: string;
}

export interface Homepage {
  id: number;
  site_name?: string;
  logo?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_bg?: string;
  blocks?: any[];
  meta_title?: string;
  meta_description?: string;
  updated_at: string;
}

async function query(sql: string) {
  const API_BASE = import.meta.env.VITE_API_BASE || '';
  const response = await fetch(`${API_BASE}/api/db-query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql })
  });
  
  if (!response.ok) {
    throw new Error(`DB query failed: ${response.statusText}`);
  }
  
  return response.json();
}

export const dbService = {
  async getServices(visible?: boolean): Promise<Service[]> {
    let sql = `SELECT * FROM ${SCHEMA}.services WHERE removed_at IS NULL`;
    if (visible !== undefined) {
      sql += ` AND visible = ${visible}`;
    }
    sql += ` ORDER BY sort_order, created_at DESC`;
    const result = await query(sql);
    return result.rows || [];
  },

  async getService(id: number): Promise<Service | null> {
    const sql = `SELECT * FROM ${SCHEMA}.services WHERE id = ${id} AND removed_at IS NULL`;
    const result = await query(sql);
    return result.rows?.[0] || null;
  },

  async createService(data: Partial<Service>): Promise<Service> {
    const slug = data.slug || data.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';
    const images = data.images ? `ARRAY[${data.images.map(img => `'${img}'`).join(',')}]` : 'ARRAY[]::text[]';
    
    const sql = `
      INSERT INTO ${SCHEMA}.services 
      (title, slug, short_desc, description, price, unit, visible, sort_order, images, meta_title, meta_description)
      VALUES (
        '${data.title}', '${slug}', 
        ${data.short_desc ? `'${data.short_desc}'` : 'NULL'},
        ${data.description ? `'${data.description}'` : 'NULL'},
        ${data.price || 0}, 
        ${data.unit ? `'${data.unit}'` : `'шт'`},
        ${data.visible !== false}, ${data.sort_order || 0},
        ${images},
        ${data.meta_title ? `'${data.meta_title}'` : 'NULL'},
        ${data.meta_description ? `'${data.meta_description}'` : 'NULL'}
      )
      RETURNING *
    `;
    const result = await query(sql);
    return result.rows[0];
  },

  async updateService(id: number, data: Partial<Service>): Promise<Service> {
    const slug = data.slug || data.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';
    const images = data.images ? `ARRAY[${data.images.map(img => `'${img}'`).join(',')}]` : 'ARRAY[]::text[]';
    
    const sql = `
      UPDATE ${SCHEMA}.services 
      SET title = '${data.title}', slug = '${slug}',
          short_desc = ${data.short_desc ? `'${data.short_desc}'` : 'NULL'},
          description = ${data.description ? `'${data.description}'` : 'NULL'},
          price = ${data.price || 0},
          unit = ${data.unit ? `'${data.unit}'` : `'шт'`},
          visible = ${data.visible !== false},
          sort_order = ${data.sort_order || 0},
          images = ${images},
          meta_title = ${data.meta_title ? `'${data.meta_title}'` : 'NULL'},
          meta_description = ${data.meta_description ? `'${data.meta_description}'` : 'NULL'},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND removed_at IS NULL
      RETURNING *
    `;
    const result = await query(sql);
    return result.rows[0];
  },

  async toggleServiceVisibility(id: number): Promise<Service> {
    const sql = `
      UPDATE ${SCHEMA}.services 
      SET visible = NOT visible, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    const result = await query(sql);
    return result.rows[0];
  },

  async archiveService(id: number): Promise<void> {
    const sql = `
      UPDATE ${SCHEMA}.services 
      SET removed_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    await query(sql);
  },

  async getPosts(visible?: boolean): Promise<Post[]> {
    let sql = `SELECT * FROM ${SCHEMA}.posts WHERE removed_at IS NULL`;
    if (visible !== undefined) {
      sql += ` AND visible = ${visible}`;
    }
    sql += ` ORDER BY published_at DESC NULLS LAST, created_at DESC`;
    const result = await query(sql);
    return result.rows || [];
  },

  async getPost(id: number): Promise<Post | null> {
    const sql = `SELECT * FROM ${SCHEMA}.posts WHERE id = ${id} AND removed_at IS NULL`;
    const result = await query(sql);
    return result.rows?.[0] || null;
  },

  async createPost(data: Partial<Post>): Promise<Post> {
    const slug = data.slug || data.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';
    const gallery = data.gallery ? `ARRAY[${data.gallery.map(img => `'${img}'`).join(',')}]` : 'ARRAY[]::text[]';
    
    const sql = `
      INSERT INTO ${SCHEMA}.posts 
      (title, slug, excerpt, body, gallery, visible, published_at, meta_title, meta_description)
      VALUES (
        '${data.title}', '${slug}',
        ${data.excerpt ? `'${data.excerpt}'` : 'NULL'},
        ${data.body ? `'${data.body}'` : 'NULL'},
        ${gallery},
        ${data.visible !== false},
        ${data.published_at ? `'${data.published_at}'` : 'NULL'},
        ${data.meta_title ? `'${data.meta_title}'` : 'NULL'},
        ${data.meta_description ? `'${data.meta_description}'` : 'NULL'}
      )
      RETURNING *
    `;
    const result = await query(sql);
    return result.rows[0];
  },

  async updatePost(id: number, data: Partial<Post>): Promise<Post> {
    const slug = data.slug || data.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';
    const gallery = data.gallery ? `ARRAY[${data.gallery.map(img => `'${img}'`).join(',')}]` : 'ARRAY[]::text[]';
    
    const sql = `
      UPDATE ${SCHEMA}.posts 
      SET title = '${data.title}', slug = '${slug}',
          excerpt = ${data.excerpt ? `'${data.excerpt}'` : 'NULL'},
          body = ${data.body ? `'${data.body}'` : 'NULL'},
          gallery = ${gallery},
          visible = ${data.visible !== false},
          published_at = ${data.published_at ? `'${data.published_at}'` : 'NULL'},
          meta_title = ${data.meta_title ? `'${data.meta_title}'` : 'NULL'},
          meta_description = ${data.meta_description ? `'${data.meta_description}'` : 'NULL'},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND removed_at IS NULL
      RETURNING *
    `;
    const result = await query(sql);
    return result.rows[0];
  },

  async togglePostVisibility(id: number): Promise<Post> {
    const sql = `
      UPDATE ${SCHEMA}.posts 
      SET visible = NOT visible, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    const result = await query(sql);
    return result.rows[0];
  },

  async archivePost(id: number): Promise<void> {
    const sql = `
      UPDATE ${SCHEMA}.posts 
      SET removed_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    await query(sql);
  },

  async getTeamMembers(visible?: boolean): Promise<TeamMember[]> {
    let sql = `SELECT * FROM ${SCHEMA}.team_members WHERE removed_at IS NULL`;
    if (visible !== undefined) {
      sql += ` AND visible = ${visible}`;
    }
    sql += ` ORDER BY sort_order, created_at`;
    const result = await query(sql);
    return result.rows || [];
  },

  async getTeamMember(id: number): Promise<TeamMember | null> {
    const sql = `SELECT * FROM ${SCHEMA}.team_members WHERE id = ${id} AND removed_at IS NULL`;
    const result = await query(sql);
    return result.rows?.[0] || null;
  },

  async createTeamMember(data: Partial<TeamMember>): Promise<TeamMember> {
    const sql = `
      INSERT INTO ${SCHEMA}.team_members 
      (name, role, photo, phone, telegram, visible, sort_order)
      VALUES (
        '${data.name}',
        ${data.role ? `'${data.role}'` : 'NULL'},
        ${data.photo ? `'${data.photo}'` : 'NULL'},
        ${data.phone ? `'${data.phone}'` : 'NULL'},
        ${data.telegram ? `'${data.telegram}'` : 'NULL'},
        ${data.visible !== false}, ${data.sort_order || 0}
      )
      RETURNING *
    `;
    const result = await query(sql);
    return result.rows[0];
  },

  async updateTeamMember(id: number, data: Partial<TeamMember>): Promise<TeamMember> {
    const sql = `
      UPDATE ${SCHEMA}.team_members 
      SET name = '${data.name}',
          role = ${data.role ? `'${data.role}'` : 'NULL'},
          photo = ${data.photo ? `'${data.photo}'` : 'NULL'},
          phone = ${data.phone ? `'${data.phone}'` : 'NULL'},
          telegram = ${data.telegram ? `'${data.telegram}'` : 'NULL'},
          visible = ${data.visible !== false},
          sort_order = ${data.sort_order || 0},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND removed_at IS NULL
      RETURNING *
    `;
    const result = await query(sql);
    return result.rows[0];
  },

  async toggleTeamMemberVisibility(id: number): Promise<TeamMember> {
    const sql = `
      UPDATE ${SCHEMA}.team_members 
      SET visible = NOT visible, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    const result = await query(sql);
    return result.rows[0];
  },

  async archiveTeamMember(id: number): Promise<void> {
    const sql = `
      UPDATE ${SCHEMA}.team_members 
      SET removed_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;
    await query(sql);
  },

  async getContactPage(): Promise<ContactPage | null> {
    const sql = `SELECT * FROM ${SCHEMA}.contact_page LIMIT 1`;
    const result = await query(sql);
    return result.rows?.[0] || null;
  },

  async updateContactPage(data: Partial<ContactPage>): Promise<ContactPage> {
    const phones = data.phones ? `ARRAY[${data.phones.map(p => `'${p}'`).join(',')}]` : 'ARRAY[]::text[]';
    const messengers = data.messengers ? `'${JSON.stringify(data.messengers)}'::jsonb` : '{}'::jsonb;
    const socials = data.socials ? `'${JSON.stringify(data.socials)}'::jsonb` : '{}'::jsonb;
    const requisites = data.requisites ? `'${JSON.stringify(data.requisites)}'::jsonb` : '{}'::jsonb;

    const sql = `
      UPDATE ${SCHEMA}.contact_page 
      SET phones = ${phones},
          messengers = ${messengers},
          address = ${data.address ? `'${data.address}'` : 'NULL'},
          map_embed = ${data.map_embed ? `'${data.map_embed}'` : 'NULL'},
          socials = ${socials},
          requisites = ${requisites},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *
    `;
    const result = await query(sql);
    return result.rows[0];
  },

  async getHomepage(): Promise<Homepage | null> {
    const sql = `SELECT * FROM ${SCHEMA}.homepage LIMIT 1`;
    const result = await query(sql);
    return result.rows?.[0] || null;
  },

  async updateHomepage(data: Partial<Homepage>): Promise<Homepage> {
    const blocks = data.blocks ? `'${JSON.stringify(data.blocks)}'::jsonb` : '[]'::jsonb;

    const sql = `
      UPDATE ${SCHEMA}.homepage 
      SET site_name = ${data.site_name ? `'${data.site_name}'` : 'NULL'},
          logo = ${data.logo ? `'${data.logo}'` : 'NULL'},
          hero_title = ${data.hero_title ? `'${data.hero_title}'` : 'NULL'},
          hero_subtitle = ${data.hero_subtitle ? `'${data.hero_subtitle}'` : 'NULL'},
          hero_bg = ${data.hero_bg ? `'${data.hero_bg}'` : 'NULL'},
          blocks = ${blocks},
          meta_title = ${data.meta_title ? `'${data.meta_title}'` : 'NULL'},
          meta_description = ${data.meta_description ? `'${data.meta_description}'` : 'NULL'},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *
    `;
    const result = await query(sql);
    return result.rows[0];
  }
};

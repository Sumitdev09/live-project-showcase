// Supabase-backed client that replaces the old localStorage mock
import { supabase } from '@/integrations/supabase/client';

// Map entity names to Supabase table names
const TABLE_MAP = {
  Profile: 'profiles',
  Experience: 'experiences',
  Education: 'education',
  Project: 'projects',
  BlogPost: 'blog_posts',
  ContactMessage: 'contact_messages',
  SkillCategory: 'skill_categories',
};

// Map old field names to new DB column names
const FIELD_MAP = {
  created_date: 'created_at',
  order: 'sort_order',
};

const mapFieldName = (field) => {
  const isDesc = field.startsWith('-');
  const raw = isDesc ? field.slice(1) : field;
  const mapped = FIELD_MAP[raw] || raw;
  return isDesc ? `-${mapped}` : mapped;
};

// Convert DB row back to the shape the app expects
const mapRowToEntity = (row, entityName) => {
  if (!row) return row;
  const mapped = { ...row };
  // Map created_at -> created_date for compatibility
  if (mapped.created_at) {
    mapped.created_date = mapped.created_at;
  }
  // Map sort_order -> order for SkillCategory
  if (entityName === 'SkillCategory' && mapped.sort_order !== undefined) {
    mapped.order = mapped.sort_order;
  }
  return mapped;
};

// Convert entity data to DB row shape
const mapEntityToRow = (data, entityName) => {
  const mapped = { ...data };
  
  // Remove fields that shouldn't be sent to DB
  delete mapped.created_date;
  
  // Map order -> sort_order for SkillCategory
  if (entityName === 'SkillCategory' && mapped.order !== undefined) {
    mapped.sort_order = mapped.order;
    delete mapped.order;
  }
  
  // Remove created_at and updated_at (auto-managed)
  delete mapped.created_at;
  delete mapped.updated_at;
  
  return mapped;
};

function createEntityClient(entityName) {
  const tableName = TABLE_MAP[entityName];
  
  return {
    list: async (sortField) => {
      let query = supabase.from(tableName).select('*');
      
      if (sortField) {
        const mappedField = mapFieldName(sortField);
        const isDesc = mappedField.startsWith('-');
        const field = isDesc ? mappedField.slice(1) : mappedField;
        query = query.order(field, { ascending: !isDesc });
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(row => mapRowToEntity(row, entityName));
    },
    
    filter: async (criteria) => {
      let query = supabase.from(tableName).select('*');
      
      Object.entries(criteria).forEach(([key, val]) => {
        query = query.eq(key, val);
      });
      
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(row => mapRowToEntity(row, entityName));
    },
    
    create: async (data) => {
      const row = mapEntityToRow(data, entityName);
      delete row.id; // Let DB generate it
      
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(row)
        .select()
        .single();
      
      if (error) throw error;
      return mapRowToEntity(result, entityName);
    },
    
    update: async (id, data) => {
      const row = mapEntityToRow(data, entityName);
      delete row.id; // Don't update the PK
      
      const { data: result, error } = await supabase
        .from(tableName)
        .update(row)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return mapRowToEntity(result, entityName);
    },
    
    delete: async (id) => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    
    schema: () => Promise.resolve({ name: entityName }),
  };
}

export const base44 = {
  entities: {
    Profile: createEntityClient('Profile'),
    Experience: createEntityClient('Experience'),
    Education: createEntityClient('Education'),
    Project: createEntityClient('Project'),
    BlogPost: createEntityClient('BlogPost'),
    ContactMessage: createEntityClient('ContactMessage'),
    SkillCategory: createEntityClient('SkillCategory'),
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        // Try Supabase storage, fallback to data URL
        try {
          const { data, error } = await supabase.storage
            .from('uploads')
            .upload(fileName, file);
          
          if (error) throw error;
          
          const { data: urlData } = supabase.storage
            .from('uploads')
            .getPublicUrl(fileName);
          
          return { file_url: urlData.publicUrl };
        } catch {
          // Fallback to data URL if storage bucket doesn't exist
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ file_url: reader.result });
            reader.readAsDataURL(file);
          });
        }
      },
    },
  },
  auth: {
    me: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user ? { id: user.id, role: 'admin', email: user.email } : null;
    },
    logout: async () => {
      await supabase.auth.signOut();
    },
    redirectToLogin: () => {
      window.location.href = '/AdminLogin';
    },
  },
  appLogs: {
    logUserInApp: () => Promise.resolve(),
  },
};

// Mock Base44 client using localStorage for persistence

const generateId = () => Math.random().toString(36).substr(2, 9);

const SEED_DATA = {
  Profile: [
    {
      id: 'profile-1',
      full_name: 'Sumit Yadav',
      title: 'Web Developer | Graphic Designer | Digital Marketer',
      bio: 'A passionate fresh graduate with expertise in web development, graphic design, and digital marketing. I create beautiful digital experiences that inspire and engage users.',
      email: 'sumit@example.com',
      phone: '+91 98765 43210',
      location: 'India',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
      skills: [
        { name: 'HTML & CSS', level: 95 },
        { name: 'JavaScript', level: 90 },
        { name: 'React', level: 88 },
        { name: 'Photoshop', level: 93 },
        { name: 'SEO', level: 85 },
      ],
      interests: ['Technology', 'Design', 'Photography'],
      tools: ['VS Code', 'Figma', 'Photoshop', 'Illustrator', 'Google Analytics'],
      achievements: [
        { title: 'Best Web Project', description: 'Won first place in college web development competition', year: 2023 },
        { title: 'Design Excellence', description: 'Recognized for outstanding graphic design work', year: 2024 },
      ],
      skill_stats: [
        { label: 'Fast Delivery', value: '100%', icon_name: 'zap' },
        { label: 'Client Satisfaction', value: '100%', icon_name: 'heart' },
        { label: 'Creative Solutions', value: '100%', icon_name: 'lightbulb' },
        { label: 'Quality Work', value: '100%', icon_name: 'star' },
      ],
      created_date: '2024-01-01',
    }
  ],
  Experience: [
    {
      id: 'exp-1',
      company: 'Xalgoo Digital',
      position: 'Web Developer Intern',
      start_date: '2024-01-15',
      end_date: '',
      is_current: true,
      description: 'Working on modern web applications using React and building responsive designs for clients.',
      location: 'Remote',
      created_date: '2024-01-15',
    },
    {
      id: 'exp-2',
      company: 'Freelance',
      position: 'Graphic Designer',
      start_date: '2023-06-01',
      end_date: '2023-12-31',
      is_current: false,
      description: 'Created brand identities, logos, and marketing materials for small businesses.',
      location: 'India',
      created_date: '2023-06-01',
    },
  ],
  Education: [
    {
      id: 'edu-1',
      institution: 'University of Technology',
      degree: 'Bachelor of Computer Applications',
      field: 'Computer Science',
      start_year: 2021,
      end_year: 2024,
      description: 'Specialized in web technologies and digital media.',
      created_date: '2021-07-01',
    },
  ],
  Project: [
    {
      id: 'proj-1',
      title: 'E-Commerce Platform',
      description: 'A full-featured online shopping platform with cart, checkout, and payment integration. Built with React and modern web technologies.',
      image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      technologies: ['React', 'Node.js', 'Tailwind CSS', 'Stripe'],
      live_url: 'https://example.com',
      github_url: 'https://github.com',
      featured: true,
      category: 'Web Development',
      created_date: '2024-03-01',
    },
    {
      id: 'proj-2',
      title: 'Brand Identity - CoffeeHouse',
      description: 'Complete brand identity design including logo, business cards, and marketing collateral for a modern coffee shop chain.',
      image_url: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&q=80',
      technologies: ['Photoshop', 'Illustrator', 'InDesign'],
      live_url: 'https://example.com',
      featured: true,
      category: 'Graphic Design',
      created_date: '2024-02-01',
    },
    {
      id: 'proj-3',
      title: 'Social Media Campaign',
      description: 'Developed and executed a comprehensive social media marketing campaign that increased engagement by 150%.',
      image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
      technologies: ['Google Ads', 'Facebook Ads', 'Analytics'],
      live_url: 'https://example.com',
      material_url: 'https://example.com/campaign-materials',
      featured: false,
      category: 'Digital Marketing',
      created_date: '2024-01-15',
    },
    {
      id: 'proj-4',
      title: 'Portfolio Dashboard',
      description: 'An interactive dashboard for managing portfolio content with real-time analytics.',
      image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      technologies: ['React', 'Chart.js', 'Tailwind CSS'],
      live_url: 'https://example.com',
      github_url: 'https://github.com',
      featured: false,
      category: 'Web Development',
      created_date: '2023-12-01',
    },
    {
      id: 'proj-5',
      title: 'Event Poster Collection',
      description: 'A series of creative event posters and promotional graphics designed for music festivals and cultural events.',
      image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
      technologies: ['Photoshop', 'Illustrator', 'InDesign'],
      live_url: 'https://example.com/posters',
      material_url: 'https://example.com/poster-assets',
      featured: false,
      category: 'Graphic Design',
      created_date: '2023-11-01',
    },
    {
      id: 'proj-6',
      title: 'Restaurant Menu & Packaging',
      description: 'Designed a premium restaurant menu layout, food packaging labels, and takeaway bag graphics with a clean modern aesthetic.',
      image_url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80',
      technologies: ['Photoshop', 'Illustrator', 'Canva'],
      live_url: 'https://example.com/menu-design',
      material_url: 'https://example.com/menu-assets',
      featured: false,
      category: 'Graphic Design',
      created_date: '2023-10-01',
    },
    {
      id: 'proj-7',
      title: 'Social Media Graphics Kit',
      description: 'Created a complete social media branding kit with post templates, story designs, and highlight covers for an e-commerce brand.',
      image_url: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&q=80',
      technologies: ['Photoshop', 'Figma', 'Canva'],
      live_url: 'https://example.com/social-kit',
      material_url: 'https://example.com/social-assets',
      featured: false,
      category: 'Graphic Design',
      created_date: '2023-09-15',
    },
  ],
  BlogPost: [
    {
      id: 'blog-1',
      title: 'Getting Started with React in 2024',
      excerpt: 'A comprehensive guide for beginners looking to start their React journey.',
      content: '# Getting Started with React\n\nReact is one of the most popular JavaScript libraries for building user interfaces. In this article, we\'ll explore the fundamentals.\n\n## Why React?\n\nReact offers a component-based architecture that makes it easy to build and maintain complex UIs. Its virtual DOM ensures efficient rendering.\n\n## Setting Up\n\nTo get started, you\'ll need Node.js installed. Then:\n\n```bash\nnpx create-react-app my-app\ncd my-app\nnpm start\n```\n\n## Key Concepts\n\n- **Components**: Reusable UI building blocks\n- **Props**: Data passed to components\n- **State**: Internal component data\n- **Hooks**: Functions for state and lifecycle\n\nHappy coding!',
      cover_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      tags: ['React', 'JavaScript', 'Web Development'],
      published: true,
      created_date: '2024-03-15',
    },
    {
      id: 'blog-2',
      title: 'Design Principles Every Developer Should Know',
      excerpt: 'Understanding basic design principles can make you a better developer.',
      content: '# Design Principles for Developers\n\nGreat design isn\'t just for designers. As a developer, understanding these principles will help you build better products.\n\n## 1. Hierarchy\n\nVisual hierarchy guides users through your interface. Use size, color, and spacing to establish importance.\n\n## 2. Consistency\n\nConsistent patterns reduce cognitive load. Use a design system.\n\n## 3. White Space\n\nDon\'t be afraid of empty space. It improves readability and focus.\n\n## 4. Contrast\n\nEnsure sufficient contrast for accessibility and visual appeal.',
      cover_image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
      tags: ['Design', 'UI/UX', 'Tips'],
      published: true,
      created_date: '2024-02-20',
    },
    {
      id: 'blog-3',
      title: 'SEO Best Practices for 2024',
      excerpt: 'Stay ahead of the curve with these modern SEO strategies.',
      content: '# SEO Best Practices\n\nSearch engine optimization continues to evolve. Here are the key strategies for 2024.\n\n## Core Web Vitals\n\nGoogle now heavily weighs page experience. Focus on:\n- Loading speed\n- Interactivity\n- Visual stability\n\n## Content Quality\n\nCreate valuable, in-depth content that answers user questions thoroughly.\n\n## Technical SEO\n\nEnsure your site is crawlable, fast, and mobile-friendly.',
      cover_image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80',
      tags: ['SEO', 'Digital Marketing', 'Growth'],
      published: true,
      created_date: '2024-01-10',
    },
  ],
  ContactMessage: [
    {
      id: 'msg-1',
      name: 'John Smith',
      email: 'john@example.com',
      subject: 'Project Inquiry',
      message: 'Hi, I\'m interested in working together on a web development project.',
      read: false,
      created_date: '2024-03-20',
    },
  ],
  SkillCategory: [
    {
      id: 'cat-1',
      title: 'Web Development',
      icon_name: 'code',
      order: 0,
      skills: [
        { name: 'HTML & CSS', level: 95 },
        { name: 'JavaScript', level: 90 },
        { name: 'React', level: 88 },
        { name: 'Responsive Design', level: 92 },
        { name: 'UI/UX Implementation', level: 85 },
      ],
    },
    {
      id: 'cat-2',
      title: 'Graphic Design',
      icon_name: 'palette',
      order: 1,
      skills: [
        { name: 'Adobe Photoshop', level: 93 },
        { name: 'Adobe Illustrator', level: 90 },
        { name: 'Brand Identity', level: 87 },
        { name: 'Logo Design', level: 92 },
        { name: 'Print Design', level: 85 },
      ],
    },
    {
      id: 'cat-3',
      title: 'Digital Marketing',
      icon_name: 'trending-up',
      order: 2,
      skills: [
        { name: 'Social Media Strategy', level: 90 },
        { name: 'Content Marketing', level: 88 },
        { name: 'SEO Optimization', level: 85 },
        { name: 'Email Campaigns', level: 82 },
        { name: 'Analytics & Insights', level: 87 },
      ],
    },
  ],
};

const SEED_VERSION = 'v3';

function getStore(entityName) {
  const versionKey = `portfolio_seed_version`;
  const storedVersion = localStorage.getItem(versionKey);
  if (storedVersion !== SEED_VERSION) {
    // Clear all old data and re-seed
    Object.keys(SEED_DATA).forEach(name => localStorage.removeItem(`portfolio_${name}`));
    localStorage.setItem(versionKey, SEED_VERSION);
  }
  const key = `portfolio_${entityName}`;
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  const seed = SEED_DATA[entityName] || [];
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function saveStore(entityName, data) {
  localStorage.setItem(`portfolio_${entityName}`, JSON.stringify(data));
}

function createEntityClient(entityName) {
  return {
    list: (sortField) => {
      let items = getStore(entityName);
      if (sortField) {
        const desc = sortField.startsWith('-');
        const field = desc ? sortField.slice(1) : sortField;
        items = [...items].sort((a, b) => {
          const aVal = a[field] || '';
          const bVal = b[field] || '';
          if (typeof aVal === 'number') return desc ? bVal - aVal : aVal - bVal;
          return desc ? String(bVal).localeCompare(String(aVal)) : String(aVal).localeCompare(String(bVal));
        });
      }
      return Promise.resolve(items);
    },
    filter: (criteria) => {
      const items = getStore(entityName);
      const filtered = items.filter(item =>
        Object.entries(criteria).every(([key, val]) => item[key] == val)
      );
      return Promise.resolve(filtered);
    },
    create: (data) => {
      const items = getStore(entityName);
      const newItem = { ...data, id: generateId(), created_date: new Date().toISOString() };
      items.push(newItem);
      saveStore(entityName, items);
      return Promise.resolve(newItem);
    },
    update: (id, data) => {
      const items = getStore(entityName);
      const index = items.findIndex(i => i.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...data };
        saveStore(entityName, items);
        return Promise.resolve(items[index]);
      }
      return Promise.reject(new Error('Not found'));
    },
    delete: (id) => {
      const items = getStore(entityName).filter(i => i.id !== id);
      saveStore(entityName, items);
      return Promise.resolve();
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
        // Convert file to data URL for local storage
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ file_url: reader.result });
          reader.readAsDataURL(file);
        });
      },
    },
  },
  auth: {
    me: () => Promise.resolve({ id: 'user-1', role: 'admin' }),
    logout: () => {},
    redirectToLogin: () => {},
  },
  appLogs: {
    logUserInApp: () => Promise.resolve(),
  },
};

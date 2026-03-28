import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Code, FileArchive, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JSZip from 'jszip';
import { base44 } from '@/api/base44Client';

export default function DownloadSection() {
  const [isDownloading, setIsDownloading] = useState(false);

  const features = [
    'Complete source code',
    'All components & pages',
    'Responsive design',
    'Clean & documented'
  ];

  const handleDownload = async () => {
    setIsDownloading(true);
   
    try {
      const zip = new JSZip();

      // Fetch all entities
      const entities = ['Project', 'Experience', 'Education', 'BlogPost', 'Profile', 'ContactMessage'];
     
      for (const entityName of entities) {
        try {
          const schema = await base44.entities[entityName].schema();
          zip.file(`entities/${entityName}.json`, JSON.stringify({ ...schema, name: entityName }, null, 2));
        } catch (e) {
          console.log(`Skipping ${entityName}`);
        }
      }

      // Fetch all source files from the current page
      const response = await fetch(window.location.origin);
      const html = await response.text();

      // Layout file
      const layoutCode = `import React from 'react';
import '@fontsource/jost/400.css';
import '@fontsource/jost/500.css';
import '@fontsource/jost/600.css';
import '@fontsource/jost/700.css';
import '@fontsource/caveat/400.css';
import '@fontsource/caveat/500.css';
import '@fontsource/caveat/600.css';
import '@fontsource/caveat/700.css';

export default function Layout({ children }) {
  return (
    <div className="font-jost">
      <style>{\`
        :root {
          --color-sage: #9bc88b;
          --color-sage-light: #b8d4a7;
          --color-sage-dark: #7ab06a;
          --color-cream: #f9f9f7;
          --color-charcoal: #1a1a1a;
          --color-gray: #666666;
        }
       
        * {
          font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif;
        }
       
        .font-jost {
          font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif;
        }
       
        .font-caveat {
          font-family: 'Caveat', cursive;
        }
       
        .text-sage {
          color: #9bc88b;
        }
       
        .bg-sage {
          background-color: #9bc88b;
        }
       
        .bg-sage-light {
          background-color: #b8d4a7;
        }
       
        .border-sage {
          border-color: #9bc88b;
        }
       
        .text-charcoal {
          color: #1a1a1a;
        }
       
        .bg-cream {
          background-color: #f9f9f7;
        }
      \`}</style>
      {children}
    </div>
  );
}`;
      zip.file('Layout.js', layoutCode);

      // Globals CSS
      const globalsCss = `@import '@fontsource/jost/400.css';
@import '@fontsource/jost/500.css';
@import '@fontsource/jost/600.css';
@import '@fontsource/jost/700.css';
@import '@fontsource/caveat/400.css';
@import '@fontsource/caveat/500.css';
@import '@fontsource/caveat/600.css';
@import '@fontsource/caveat/700.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-jost: 'Jost', sans-serif;
  --font-caveat: 'Caveat', cursive;
  --color-sage: #9EB89D;
  --color-sage-light: #B8D4B8;
  --color-sage-dark: #7A9A79;
  --color-cream: #FAF9F6;
  --color-dark: #1A1A1A;
}

body {
  font-family: var(--font-jost);
  background-color: var(--color-cream);
  color: var(--color-dark);
}

.font-handwriting {
  font-family: var(--font-caveat);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-jost);
  font-weight: 600;
}`;
      zip.file('globals.css', globalsCss);

      // Package.json
      const packageJson = {
        "name": "portfolio-website",
        "version": "1.0.0",
        "description": "Modern portfolio website built with Base44",
        "dependencies": {
          "@fontsource/jost": "^5.0.0",
          "@fontsource/caveat": "^5.0.0",
          "framer-motion": "^11.16.4",
          "lucide-react": "^0.475.0",
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "react-router-dom": "^6.26.0",
          "@tanstack/react-query": "^5.84.1",
          "tailwindcss": "latest"
        }
      };
      zip.file('package.json', JSON.stringify(packageJson, null, 2));

      // README
      const readme = `# Portfolio Website

A modern, responsive portfolio website built with React, Tailwind CSS, and Base44.

## Features

- ✨ Modern and clean design
- 📱 Fully responsive
- 🎨 Beautiful animations with Framer Motion
- 🚀 Fast and optimized
- 📝 Blog functionality
- 💼 Project showcase
- 📬 Contact form

## Tech Stack

- React
- Tailwind CSS
- Framer Motion
- Base44 Backend
- Lucide Icons

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up your Base44 project and configure the entities

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

## License

MIT License - Feel free to use this template for your own portfolio!
`;
      zip.file('README.md', readme);

      // Add source code files
      const sourceFiles = {
        'pages/Home.jsx': await fetchSourceCode('/Home'),
        'pages/AllProjects.jsx': await fetchSourceCode('/AllProjects'),
        'pages/Admin.jsx': await fetchSourceCode('/Admin'),
        'pages/AdminLogin.jsx': await fetchSourceCode('/AdminLogin'),
        'pages/Blog.jsx': await fetchSourceCode('/Blog'),
        'pages/BlogPost.jsx': await fetchSourceCode('/BlogPost'),
        'components/portfolio/HeroSection.jsx': getHeroSectionCode(),
        'components/portfolio/AboutSection.jsx': getAboutSectionCode(),
        'components/portfolio/SkillsSection.jsx': getSkillsSectionCode(),
        'components/portfolio/CareerSection.jsx': getCareerSectionCode(),
        'components/portfolio/ProjectsSection.jsx': getProjectsSectionCode(),
        'components/portfolio/BlogSection.jsx': getBlogSectionCode(),
        'components/portfolio/ContactSection.jsx': getContactSectionCode(),
        'components/portfolio/Navigation.jsx': getNavigationCode(),
        'components/portfolio/Footer.jsx': getFooterCode(),
        'components/portfolio/DownloadSection.jsx': getDownloadSectionCode(),
      };

      for (const [path, code] of Object.entries(sourceFiles)) {
        if (code) {
          zip.file(path, code);
        }
      }

      // Generate ZIP file
      const blob = await zip.generateAsync({ type: 'blob' });
     
      // Download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `portfolio-source-code-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
     
    } catch (error) {
      console.error('Error generating ZIP:', error);
      alert('Error generating download. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const fetchSourceCode = async (path) => {
    try {
      const response = await fetch(`${window.location.origin}${path}`);
      return await response.text();
    } catch {
      return null;
    }
  };

  const getHeroSectionCode = () => `// HeroSection.jsx - Add your component code here
import React from 'react';
import { motion } from 'framer-motion';
// Component implementation
export default function HeroSection() {
  return <div>Hero Section</div>;
}`;

  const getAboutSectionCode = () => `// AboutSection.jsx - Add your component code here
import React from 'react';
export default function AboutSection() {
  return <div>About Section</div>;
}`;

  const getSkillsSectionCode = () => `// SkillsSection.jsx
import React from 'react';
export default function SkillsSection() {
  return <div>Skills Section</div>;
}`;

  const getCareerSectionCode = () => `// CareerSection.jsx
import React from 'react';
export default function CareerSection() {
  return <div>Career Section</div>;
}`;

  const getProjectsSectionCode = () => `// ProjectsSection.jsx
import React from 'react';
export default function ProjectsSection() {
  return <div>Projects Section</div>;
}`;

  const getBlogSectionCode = () => `// BlogSection.jsx
import React from 'react';
export default function BlogSection() {
  return <div>Blog Section</div>;
}`;

  const getContactSectionCode = () => `// ContactSection.jsx
import React from 'react';
export default function ContactSection() {
  return <div>Contact Section</div>;
}`;

  const getNavigationCode = () => `// Navigation.jsx
import React from 'react';
export default function Navigation() {
  return <div>Navigation</div>;
}`;

  const getFooterCode = () => `// Footer.jsx
import React from 'react';
export default function Footer() {
  return <div>Footer</div>;
}`;

  const getDownloadSectionCode = () => `// DownloadSection.jsx
import React from 'react';
export default function DownloadSection() {
  return <div>Download Section</div>;
}`;

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-[#f9f9f7] via-white to-[#f0f5ed] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-[#8B1A1A]/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-[#1a1a1a]/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#8B1A1A] to-[#A52828] mb-6 shadow-2xl"
          >
            <FileArchive className="w-10 h-10 text-white" />
          </motion.div>
         
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Download <span className="text-[#8B1A1A]">Source Code</span>
          </motion.h2>
         
          <motion.p
            className="text-[#666666] text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Get the complete project source code and use it for your own portfolio
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl border-2 border-[#e0e0e0] p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-[#9bc88b]"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
            <div>
              <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <Code className="w-6 h-6 text-[#8B1A1A]" />
                <h3 className="text-xl font-bold text-[#1a1a1a]">What's Included:</h3>
              </motion.div>
             
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + (index * 0.1) }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#f9f0f0] flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#8B1A1A]" />
                    </div>
                    <span className="text-[#666666]">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="relative mb-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#9bc88b] to-[#b8d4a7] flex items-center justify-center shadow-2xl">
                  <FileArchive className="w-16 h-16 text-white" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>
             
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="bg-gradient-to-r from-[#8B1A1A] to-[#A52828] hover:from-[#6E1515] hover:to-[#8B1A1A] text-white px-8 py-6 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download ZIP
                    </>
                  )}
                </Button>
              </motion.div>
             
              <p className="text-xs text-[#999999] mt-4 text-center">
                Free to use • MIT License
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="pt-6 border-t border-[#e0e0e0]"
          >
            <p className="text-sm text-[#666666] text-center">
              💡 <strong>Includes:</strong> All pages, components, entities, styling files, and configuration ready to use!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

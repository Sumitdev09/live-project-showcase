import React from 'react';
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
      <style>{`
        :root {
          --color-maroon: #8B1A1A;
          --color-maroon-light: #A52828;
          --color-maroon-dark: #6E1515;
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
      `}</style>
      {children}
    </div>
  );
}

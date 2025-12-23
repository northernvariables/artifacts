/** @type {import('tailwindcss').Config} */
module.exports = {
  // Content paths for all packages
  content: [
    './packages/*/src/**/*.{js,jsx,ts,tsx}',
    './packages/*/index.html',
    './packages/artifacts/*/src/**/*.{js,jsx,ts,tsx}',
    './index.html'
  ],

  // Enable dark mode via media query (prefers-color-scheme)
  darkMode: 'media',

  theme: {
    extend: {
      // Unified color palette - merging artifacts and WordPress main site colors
      colors: {
        // Northern Variables artifacts brand colors
        nv: {
          primary: '#0f2747',      // Dark blue (artifacts primary)
          'primary-dark': '#091a30',
          'primary-mid': '#163b6b',
          accent: '#ff6719',       // Orange accent
          'accent-dark': '#d85612',
          text: '#0f172a',        // Near black text
          soft: '#f1f5f9'         // Soft background
        },
        // WordPress main site brand colors
        brand: {
          primary: '#2563eb',     // WordPress blue
          secondary: '#ff6719'    // Orange (same as nv-accent)
        }
      },

      // Typography scale using clamp for fluid sizing
      fontSize: {
        'xs': ['clamp(0.75rem, 1.5vw, 0.875rem)', { lineHeight: '1.5' }],
        'sm': ['clamp(0.875rem, 2vw, 1rem)', { lineHeight: '1.5' }],
        'base': ['clamp(1rem, 2.5vw, 1.125rem)', { lineHeight: '1.6' }],
        'lg': ['clamp(1.125rem, 2.75vw, 1.25rem)', { lineHeight: '1.6' }],
        'xl': ['clamp(1.25rem, 3vw, 1.5rem)', { lineHeight: '1.4' }],
        '2xl': ['clamp(1.5rem, 3.5vw, 1.875rem)', { lineHeight: '1.3' }],
        '3xl': ['clamp(1.875rem, 4vw, 2.25rem)', { lineHeight: '1.25' }],
        '4xl': ['clamp(2.25rem, 5vw, 3rem)', { lineHeight: '1.2' }],
        '5xl': ['clamp(3rem, 6vw, 3.75rem)', { lineHeight: '1.1' }]
      },

      // Spacing scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },

      // Font families
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ]
      },

      // Minimum touch target sizes for accessibility (WCAG 2.1 Level AAA)
      minWidth: {
        'touch': '44px'
      },
      minHeight: {
        'touch': '44px'
      },

      // Border radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem'
      },

      // Box shadows
      boxShadow: {
        'nv': '0 10px 30px rgba(9, 26, 48, 0.25)',
        'nv-soft': '0 12px 30px rgba(9, 26, 48, 0.15)'
      },

      // Animation durations that respect prefers-reduced-motion
      transitionDuration: {
        'DEFAULT': '200ms'
      },

      // Backdrop filters
      backdropBlur: {
        'nv': '6px'
      }
    }
  },

  plugins: [
    // Tailwind official plugins
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),

    // Custom plugin for accessibility and dark mode utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Touch-friendly minimum sizes
        '.min-touch': {
          minWidth: '44px',
          minHeight: '44px'
        },
        // Skip link utility (for keyboard navigation)
        '.skip-link': {
          position: 'absolute',
          top: '-40px',
          left: '0',
          background: theme('colors.nv.accent'),
          color: 'white',
          padding: '0.5rem 1rem',
          textDecoration: 'none',
          zIndex: '100'
        },
        '.skip-link:focus': {
          top: '0'
        }
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ]
}

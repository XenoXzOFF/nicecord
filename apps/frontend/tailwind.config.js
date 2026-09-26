/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 500: '#5865F2', 600: '#4755EB' },
        bg: {
          default: '#313338',
          secondary: '#2B2D31',
          tertiary: '#25262A',
          accent: '#1E1F22',
        },
        interactive: { hover: '#383A40', active: '#2A2B2F' },
        text: {
          primary: '#FFFFFF',
          secondary: '#B5BAC1',
          tertiary: '#8E9297',
        },
        status: {
          online: '#57F089',
          idle: '#FFAF58',
          dnd: '#F0595E',
          offline: '#6A6D74',
        },
      },
      fontFamily: {
        sans: ['Whitney', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Cascadia Code"', 'monospace'],
      },
      spacing: { sidebar: '240px', 'user-panel': '316px' },
    },
  },
  plugins: [],
};

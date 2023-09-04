/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        brandLight: "#74FFAC",
        brandNormal: "#38CB7C",
        brandDark: "#00994F",
        normalBackground: "#37C078",
        darkBackground: {
            800: "#1D1D1D",
            900: "#37C078",
            700: "#37C078"
      },
    },
    },
  },
  plugins: [],
}

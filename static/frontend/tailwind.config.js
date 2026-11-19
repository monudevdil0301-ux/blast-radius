/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atlassian: {
          blue: '#0052CC',
          darkBlue: '#172B4D',
          lightBlue: '#DEEBFF',
          red: '#DE350B',
          amber: '#FFAB00',
          green: '#36B37E',
          teal: '#00B8D9',
          neutral10: '#FAFBFC',
          neutral20: '#F4F5F7',
          neutral30: '#EBECF0',
          neutral90: '#091E42'
        }
      }
    },
  },
  plugins: [],
}

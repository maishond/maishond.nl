/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      animation: {
        'fadein': 'fadein 1s ease-in-out forwards',
      },
      keyframes: {
        'fadein': {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        }
      }
    },
	},
	plugins: [],
}

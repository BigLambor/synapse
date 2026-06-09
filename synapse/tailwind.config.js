/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 阿里云百炼风格浅色主题（保留 cursor-* 类名以兼容全站）
        cursor: {
          bg: '#f5f6f8',
          surface: '#ffffff',
          panel: '#fafbfc',
          elevated: '#f2f3f5',
          border: '#e5e6eb',
          'border-subtle': 'rgba(0, 0, 0, 0.06)',
          fg: '#1d2129',
          'fg-muted': '#86909c',
          'fg-subtle': '#c9cdd4',
          accent: '#1677ff',
          'accent-hover': '#4096ff',
          'accent-muted': 'rgba(22, 119, 255, 0.08)',
          active: 'rgba(22, 119, 255, 0.1)',
          'surface-hover': '#f2f3f5',
          input: '#ffffff',
          selection: 'rgba(22, 119, 255, 0.2)',
        },

        primary: {
          50: '#e6f4ff',
          100: '#bae0ff',
          200: '#91caff',
          300: '#69b1ff',
          400: '#4096ff',
          500: '#1677ff',
          600: '#0958d9',
          700: '#003eb3',
          800: '#002c8c',
          900: '#001d66',
        },

        secondary: {
          500: '#13c2c2',
          600: '#08979c',
        },

        accent: {
          500: '#722ed1',
          600: '#531dab',
        },

        neutral: {
          50: '#fafbfc',
          100: '#f2f3f5',
          200: '#e5e6eb',
          300: '#c9cdd4',
          400: '#a9aeb8',
          500: '#86909c',
          600: '#6b7785',
          700: '#4e5969',
          800: '#272e3b',
          900: '#1d2129',
          950: '#0f1219',
        },

        success: '#00b42a',
        warning: '#ff7d00',
        error: '#f53f3f',
        info: '#1677ff',
      },

      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'PingFang SC', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.75rem', { lineHeight: '1.25rem' }],
      },

      borderRadius: {
        cursor: '6px',
      },

      boxShadow: {
        cursor: '0 1px 2px rgba(0, 0, 0, 0.06)',
        'cursor-lg': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },

      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

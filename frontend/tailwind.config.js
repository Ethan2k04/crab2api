/** @type {import('tailwindcss').Config} */
/**
 * Crab2API design tokens.
 *
 * The palette is derived from Claude's own brand colours:
 *   #c15f3c  clay / terracotta  -> primary
 *   #ffffff  white              -> surface (light)
 *   #f4f3ee  bone / cream       -> page background (light)
 *   #b1ada1  warm grey          -> muted text & borders
 *
 * `gray`, `accent` and `dark` are deliberately overridden with warm neutrals so
 * that the inherited console screens re-skin themselves without touching every
 * utility class. Ordering is kept identical to Tailwind's default scales
 * (50 = lightest, 950 = darkest) so existing markup keeps its intent.
 */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 主色调 - Claude 陶土色系 (#c15f3c)
        primary: {
          50: '#fbf4f1',
          100: '#f6e6df',
          200: '#eccabb',
          300: '#dfa78e',
          400: '#d18060',
          500: '#c15f3c',
          600: '#a94f31',
          700: '#8b3f28',
          800: '#6f3421',
          900: '#5a2c1d',
          950: '#31160e'
        },
        // 辅助色 - 暖调中性灰 (#b1ada1)
        accent: {
          50: '#faf9f7',
          100: '#f4f3ee',
          200: '#e7e5de',
          300: '#d4d1c8',
          400: '#b1ada1',
          500: '#8a8679',
          600: '#6b6760',
          700: '#52504a',
          800: '#37352f',
          900: '#24221f',
          950: '#171614'
        },
        // 中性色 - 覆盖 Tailwind 冷灰，统一为 Claude 暖灰
        gray: {
          50: '#faf9f7',
          100: '#f4f3ee',
          200: '#e7e5de',
          300: '#d4d1c8',
          400: '#b1ada1',
          500: '#8a8679',
          600: '#6b6760',
          700: '#52504a',
          800: '#37352f',
          900: '#24221f',
          950: '#171614'
        },
        // 深色模式表面 - 暖黑，避免蓝调
        dark: {
          50: '#f4f3ee',
          100: '#e9e7df',
          200: '#d5d2c8',
          300: '#b1ada1',
          400: '#8f8b80',
          500: '#6f6c63',
          600: '#55524b',
          700: '#3e3c37',
          800: '#2b2a27',
          900: '#201f1d',
          950: '#171614'
        },
        // 语义化品牌别名，供新页面直接引用
        bone: '#f4f3ee',
        clay: '#c15f3c'
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif'
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'JetBrains Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      },
      boxShadow: {
        glass: '0 8px 32px rgba(36, 34, 31, 0.08)',
        'glass-sm': '0 4px 16px rgba(36, 34, 31, 0.06)',
        glow: '0 0 20px rgba(193, 95, 60, 0.25)',
        'glow-lg': '0 0 40px rgba(193, 95, 60, 0.35)',
        card: '0 1px 3px rgba(36, 34, 31, 0.05), 0 1px 2px rgba(36, 34, 31, 0.07)',
        'card-hover': '0 10px 40px rgba(36, 34, 31, 0.10)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #c15f3c 0%, #a94f31 100%)',
        'gradient-dark': 'linear-gradient(135deg, #2b2a27 0%, #171614 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'mesh-gradient':
          'radial-gradient(at 40% 20%, rgba(193, 95, 60, 0.10) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(177, 173, 161, 0.10) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(193, 95, 60, 0.07) 0px, transparent 50%)',
        // 极客风网格底纹，落地页使用
        'grid-light':
          'linear-gradient(rgba(36,34,31,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(36,34,31,0.045) 1px, transparent 1px)',
        'grid-dark':
          'linear-gradient(rgba(244,243,238,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(244,243,238,0.045) 1px, transparent 1px)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        blink: 'blink 1.1s step-end infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(193, 95, 60, 0.25)' },
          '100%': { boxShadow: '0 0 30px rgba(193, 95, 60, 0.4)' }
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
}

import * as Animations from './animations';

export const DesignSystem = {
  colors: {
    emerald: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
    },
    teal: {
      600: '#0d9488',
      700: '#0f766e',
    },
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    background: 'var(--tf-bg)',
    backgroundSecondary: 'var(--tf-bg-2)',
  },
  gradients: {
    main: 'var(--tf-gradient-main)',
    hero: 'var(--tf-gradient-hero)',
    card: 'var(--tf-gradient-card)',
  },
  glass: {
    background: 'var(--tf-glass-bg)',
    border: 'var(--tf-glass-border)',
    shadow: 'var(--tf-glass-shadow)',
    blur: 'var(--tf-glass-blur)',
  },
  shadows: {
    sm: 'var(--tf-shadow-sm)',
    md: 'var(--tf-shadow-md)',
    lg: 'var(--tf-shadow-lg)',
    glow: 'var(--tf-shadow-glow)',
  },
  radius: {
    sm: 'var(--tf-radius-sm)',
    md: 'var(--tf-radius-md)',
    lg: 'var(--tf-radius-lg)',
    xl: 'var(--tf-radius-xl)',
    '2xl': 'var(--tf-radius-2xl)',
  },
  transitions: {
    ease: 'var(--tf-ease)',
    spring: 'var(--tf-ease-spring)',
    out: 'var(--tf-ease-out)',
  },
  animations: Animations,
};

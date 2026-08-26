import { Variants } from 'framer-motion'

/* ─── Entry Animations ─────────────────────────────── */

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
}

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(12px)', scale: 0.96 },
  visible: {
    opacity: 1, filter: 'blur(0px)', scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const springScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1, scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 20 },
  },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -8, scale: 0.95 },
  visible: {
    opacity: 1, rotate: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

/* ─── Stagger Containers ──────────────────────────── */

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
}

export const staggerSlow: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
}

/* ─── Page Transitions ────────────────────────────── */

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0, y: -8,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

/* ─── Interactive Animations ──────────────────────── */

export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
}

export const hoverLift = {
  y: -3,
  boxShadow: '0 16px 48px rgba(5, 150, 105, 0.18)',
  transition: { duration: 0.2 },
}

export const tapScale = {
  scale: 0.97,
  transition: { duration: 0.1 },
}

export const hoverGlow = {
  boxShadow: '0 0 30px rgba(5, 150, 105, 0.35)',
  transition: { duration: 0.3 },
}

/* ─── Shake (validation error) ────────────────────── */

export const shakeAnimation = {
  x: [0, -8, 8, -8, 8, -4, 4, 0],
  transition: { duration: 0.4 },
}

/* ─── Floating ────────────────────────────────────── */

export const floatingAnimation = {
  y: [0, -10, 0],
  transition: { duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' as const },
}

export const floatingSlow = {
  y: [0, -6, 0],
  transition: { duration: 5, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' as const },
}

/* ─── Progress Bar Reveal ─────────────────────────── */

export function progressReveal(percent: number, delay = 0.3) {
  return {
    initial: { width: 0 },
    animate: { width: `${percent}%` },
    transition: { duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }
}

/* ─── Counter animation (for Framer Motion) ──────── */
export const counterProps = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: 'spring', stiffness: 200, damping: 15 },
}

/* ─── Modal ───────────────────────────────────────── */
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0, scale: 0.95, y: 10,
    transition: { duration: 0.2 },
  },
}

/* ─── Drawer / Bottom Sheet ───────────────────────── */
export const bottomSheetVariants: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: 'spring', stiffness: 280, damping: 28 },
  },
  exit: {
    y: '100%', opacity: 0,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

/* ─── Notification Badge ──────────────────────────── */
export const badgePop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1, opacity: 1,
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  },
}
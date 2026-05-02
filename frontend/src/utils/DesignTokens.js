export const COLORS = {
    primary: '#D97706',
    primaryHover: '#B45309',
    bg: '#0A0A0A',
    card: '#111111',
    border: 'rgba(255, 255, 255, 0.08)',
    textMuted: '#94A3B8',
};

export const FADE_IN = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' }
};

export const STAGGER_CHILDREN = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const HOVER_SCALE = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
};

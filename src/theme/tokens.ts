
export const Colors = {
  // Core backgrounds - sophisticated dark palette
  bg: '#0A0A0A',  // Rich black with subtle warmth
  surface: '#141416', // Elevated surfaces
  surfaceElevated: '#1C1C1E', // Cards and modals
  card: '#141416',
  
  // Text hierarchy for luxury readability
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF', // Sophisticated gray
  textTertiary: '#6B7280', // Muted supporting text
  
  // Refined accent - moving from bright orange to sophisticated tones
  accent: '#D4AF37', // Elegant gold tone
  accentDark: '#B8941F',
  accentSubtle: 'rgba(212, 175, 55, 0.1)',
  accentMuted: 'rgba(212, 175, 55, 0.6)', // For subtle highlights
  
  // Sophisticated gradients
  gradient: ['#D4AF37', '#B8941F'], // Elegant gold gradient
  gradientCalm: ['#1C1C1E', '#141416'], // Subtle surface gradients
  
  // Premium glass and blur effects
  glass: 'rgba(255, 255, 255, 0.03)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassActive: 'rgba(255, 255, 255, 0.06)',
  
  // Refined borders and overlays
  border: 'rgba(255, 255, 255, 0.06)',
  borderSubtle: 'rgba(255, 255, 255, 0.03)',
  overlay: 'rgba(0, 0, 0, 0.75)',
  overlayCalm: 'rgba(0, 0, 0, 0.4)',
  
  // Status colors - muted and sophisticated
  success: '#059669', // Deep emerald
  warning: '#D97706', // Warm amber
  error: '#DC2626', // Refined red
  
  // Special luxury touches
  metallic: '#E5E7EB', // Silver accents
  metallicWarm: '#F3F4F6', // Warm silver
};

export const Typography = {
  // Premium serif for headings - luxury branding
  hero: {
    fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
    fontSize: '40px',
    fontWeight: '300', // Light and elegant
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
  },
  
  // Sophisticated title hierarchy
  title: {
    fontFamily: 'ui-serif, Georgia, "Times New Roman", serif',
    fontSize: '28px',
    fontWeight: '400',
    lineHeight: '1.2',
    letterSpacing: '-0.015em',
  },
  
  // Clean sans-serif for UI elements
  subtitle: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    fontSize: '20px',
    fontWeight: '500',
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
  },
  
  // Refined body text for readability
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '1.6', // Generous line height for luxury feel
    letterSpacing: '0.01em',
  },
  
  bodyMedium: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '1.5',
    letterSpacing: '0.01em',
  },
  
  bodySmall: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '1.5',
    letterSpacing: '0.02em',
  },
  
  caption: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '1.4',
    letterSpacing: '0.02em',
  },
  
  // Elegant button typography
  button: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '1.2',
    letterSpacing: '0.01em',
  },
  
  // Refined form labels
  label: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '1.4',
    letterSpacing: '0.02em',
  },
};

// Luxury spacing system - generous and harmonious
export const Spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
  // Premium spacing for luxury feel
  premium: '80px',
  hero: '120px',
};

// Refined border radius for sophisticated edges
export const BorderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  full: '9999px',
  // Subtle luxury radius
  elegant: '14px',
};

// Sophisticated shadow system
export const Shadows = {
  // Subtle depth without harshness
  subtle: '0 1px 3px rgba(0, 0, 0, 0.2)',
  elegant: '0 4px 16px rgba(0, 0, 0, 0.15)',
  premium: '0 8px 32px rgba(0, 0, 0, 0.12)',
  // Glass effect shadows
  glass: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  floating: '0 8px 24px rgba(0, 0, 0, 0.2)',
};

// Refined animation timing
export const Animation = {
  // Calm, sophisticated timing
  fast: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  medium: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  // Luxury easing
  elegant: '350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  calm: '500ms cubic-bezier(0.23, 1, 0.32, 1)',
};

// Layout system for consistent luxury spacing
export const Layout = {
  containerPadding: '20px',
  sectionSpacing: '48px',
  cardPadding: '24px',
  // Premium content spacing
  luxuryPadding: '32px',
  heroSpacing: '64px',
};

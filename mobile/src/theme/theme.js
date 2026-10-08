export const lightTheme = {
  isDark: false,
  colors: {
    primary: '#2563EB',
    primaryLight: '#EFF6FF',
    primaryDark: '#1D4ED8',
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    
    // Status & Badges
    success: '#10B981',
    successBg: '#DCFCE7',
    successText: '#15803D',
    
    warning: '#F59E0B',
    warningBg: '#FEF3C7',
    warningText: '#B45309',
    
    danger: '#EF4444',
    dangerBg: '#FEE2E2',
    dangerText: '#B91C1C',
    dangerDark: '#991B1B',
    
    info: '#3B82F6',
    infoBg: '#DBEAFE',
    infoText: '#1D4ED8',
    
    neutralBg: '#F1F5F9',
    neutralText: '#475569',
  },
  typography: {
    title: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
    h2: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
    h3: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
    body: { fontSize: 14, color: '#334155' },
    caption: { fontSize: 12, color: '#64748B' },
    small: { fontSize: 11, color: '#94A3B8' },
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
};

export const darkTheme = {
  isDark: true,
  colors: {
    primary: '#3B82F6',
    primaryLight: '#1E3A8A',
    primaryDark: '#1D4ED8',
    background: '#090D16',       // Deep near-black
    card: '#131B2E',             // Very dark charcoal / navy surface
    cardSecondary: '#162036',
    text: '#FFFFFF',             // Full white primary text
    textSecondary: '#94A3B8',    // Light neutral gray
    textMuted: '#64748B',
    border: '#1E293B',           // Subtle dark border
    borderLight: '#1E293B',
    
    // Status & Badges
    success: '#10B981',
    successBg: '#064E3B',
    successText: '#34D399',
    
    warning: '#F59E0B',
    warningBg: '#78350F',
    warningText: '#FBBF24',
    
    danger: '#EF4444',
    dangerBg: '#7F1D1D',
    dangerText: '#F87171',
    dangerDark: '#991B1B',
    
    info: '#3B82F6',
    infoBg: '#1E3A8A',
    infoText: '#60A5FA',
    
    neutralBg: '#1E293B',
    neutralText: '#CBD5E1',
  },
  typography: {
    title: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
    h2: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
    h3: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
    body: { fontSize: 14, color: '#CBD5E1' },
    caption: { fontSize: 12, color: '#94A3B8' },
    small: { fontSize: 11, color: '#64748B' },
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
};

// Default export preserves backward compatibility with existing components
export const theme = lightTheme;

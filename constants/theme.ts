// Colores, tipografía y espaciado de la app
export const Colors = {
  // Fondo
  background: '#F4F6F8', // Gris muy claro para resaltar las tarjetas blancas
  surface: '#FFFFFF', // Blanco puro
  surfaceElevated: '#FFFFFF',
  border: '#E8ECEF',

  // Primario — Azul tipo Farmatodo
  primary: '#0055A5',
  primaryDark: '#003F7A',
  primaryLight: 'rgba(0, 85, 165, 0.1)',

  // Acento — Rojo para destacar (descuentos, eliminar)
  accent: '#E32636',
  accentLight: 'rgba(227, 38, 54, 0.1)',

  // Verde éxito
  success: '#27AE60',
  successLight: 'rgba(39, 174, 96, 0.1)',

  // Texto
  textPrimary: '#1A202C', // Casi negro para alta legibilidad
  textSecondary: '#64748B', // Gris oscuro
  textMuted: '#94A3B8', // Gris claro

  // Precios / oferta
  price: '#0055A5',
  priceOld: '#94A3B8',
  badge: '#E32636',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

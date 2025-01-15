export const lightTheme = {
  colors: {
    background: '#ffffff',
    text: '#000000',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    white: '#FFFFFF',
    primary: '#03BEED',
    primaryDark: '#c97a2f',
    secondary: '#F9BC60',
    tertiary: '#FF9671',
    almostWhite: '#f5f5f5',
    border: '#e0e0e0',
    inputBackground: '#ffffff',
    textSecondary: '#666666',
    inputText: '#000000',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32
  },
  typography: {
    small: 12,
    regular: 14,
    medium: 16,
    large: 18,
    xlarge: 24
  },
  borderRadius: { 
    small: 4,
    medium: 8,
    large: 16
  }
};

export const darkTheme = {
  colors: {
    background: '#121212',
    text: '#ffffff',
    success: '#81c784',
    error: '#e57373',
    warning: '#ffb74d',
    info: '#64b5f6',
    white: '#FFFFFF',
    primary: '#fe6899',
    primaryDark: '#e54d7f',
    secondary: '#fe6899',
    almostWhite: '#1e1e1e',
    border: '#333333',
    inputBackground: '#2d2d2d',
    textSecondary: '#999999',
    inputText: '#ffffff',
  },
  spacing: lightTheme.spacing,
  typography: lightTheme.typography,
  borderRadius: lightTheme.borderRadius
};

export const themes = {
  light: lightTheme,
  dark: darkTheme
};
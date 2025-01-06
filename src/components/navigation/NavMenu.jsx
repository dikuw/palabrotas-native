import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

import { useAuthStore } from '../../store/auth';
import { useAppStore } from '../../store/app';
import { useContentStore } from '../../store/content';
import { useNotificationStore } from '../../store/notification';

const MenuContainer = styled.View`
  background-color: ${props => themes[props.currentTheme || 'light'].colors.elevated};
  padding: ${props => themes[props.currentTheme || 'light'].spacing.medium}px;
  border-radius: ${props => themes[props.currentTheme || 'light'].borderRadius.medium}px;
`;

const MenuItem = styled(TouchableOpacity)`
  padding: ${props => themes[props.currentTheme || 'light'].spacing.medium}px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => themes[props.currentTheme || 'light'].colors.border};
  background-color: transparent;
`;

const MenuText = styled.Text`
  color: ${props => themes[props.currentTheme || 'light'].colors.text};
  font-size: 16px;
`;

export default function NavMenu({ isLoggedIn, isAdmin }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const { logoutUser } = useAuthStore();
  const { menuOpen, setMenuOpen } = useAppStore();
  const { clearSearch } = useContentStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const handleNavigation = (route) => {
    setMenuOpen(false);
    if (route === 'Home') {
      clearSearch();
    }
    navigation.navigate(route);
  };

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result) {
        navigation.navigate('Home');
        addNotification(t('Logged out successfully!'), 'success');
        setMenuOpen(false);
      }
    } catch (error) {
      addNotification(t('Logout failed. Please try again.'), 'error');
    }
  };

  const renderMenuItem = (label, route, onPress = null) => (
    <MenuItem
      onPress={onPress || (() => handleNavigation(route))}
    >
      <MenuText>{t(label)}</MenuText>
    </MenuItem>
  );

  const MenuContent = () => (
    <>
      {renderMenuItem('Home', 'Home')}
      {renderMenuItem('Add', 'AddContent')}
      
      {isLoggedIn ? (
        <>
          {renderMenuItem('Account', 'Account')}
          {renderMenuItem('Flashcards', 'Flashcards')}
          {isAdmin && renderMenuItem('Administer', 'Admin')}
          {renderMenuItem('Log Out', null, handleLogout)}
        </>
      ) : (
        renderMenuItem('Log In', 'Login') 
      )}
      {renderMenuItem('Settings', 'Config')}
    </>
  );

  if (width > 768) {
    return (
      <View style={styles.desktopMenu}>
        <MenuContent />
      </View>
    );
  }

  if (!menuOpen) {
    return null;
  }

  return (
    <>
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={() => setMenuOpen(false)}
      />
      <View style={styles.mobileMenu}>
        <MenuContent />
      </View>
    </>
  );
}
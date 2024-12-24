import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import CustomText from '../CustomText';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

import { useAuthStore } from '../../store/auth';
import { useAppStore } from '../../store/app';
import { useContentStore } from '../../store/content';
import { useNotificationStore } from '../../store/notification';

const { width } = Dimensions.get('window');

export default function NavMenu({ isLoggedIn, isAdmin }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const { logoutUser } = useAuthStore();
  const { menuOpen, setMenuOpen } = useAppStore();
  const { clearSearch } = useContentStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const styles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 998,
    },
    desktopMenu: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: 50,
      backgroundColor: themes[theme].colors.background,
    },
    mobileMenu: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: 200,
      backgroundColor: themes[theme].colors.background,
      borderRightWidth: 1,
      borderRightColor: themes[theme].colors.border,
      paddingTop: 60,
      zIndex: 999,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 2,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    menuItem: {
      paddingVertical: themes[theme].spacing.medium,
      paddingHorizontal: themes[theme].spacing.large,
    },
    menuText: {
      fontSize: themes[theme].typography.medium,
      color: themes[theme].colors.text,
    },
  });

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
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress || (() => handleNavigation(route))}
    >
      <CustomText style={styles.menuText}>{t(label)}</CustomText>
    </TouchableOpacity>
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
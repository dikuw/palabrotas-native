import React from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import CustomText from '../CustomText';

import { useAuthStore } from '../../store/auth';
import { useAppStore } from '../../store/app';
import { useContentStore } from '../../store/content';
import { useNotificationStore } from '../../store/notification';

const { width, height } = Dimensions.get('window');
const MENU_WIDTH = 150;

export default function NavMenu({ isLoggedIn, isAdmin }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { logoutUser } = useAuthStore();
  const { menuOpen, setMenuOpen } = useAppStore();
  const { clearSearch } = useContentStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const slideAnim = React.useRef(new Animated.Value(-MENU_WIDTH)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? 0 : -MENU_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [menuOpen]);

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
    </>
  );

  return (
    <>
      {/* Desktop Menu */}
      <View style={styles.desktopMenu}>
        <MenuContent />
      </View>

      {/* Mobile Menu */}
      <Animated.View
        style={[
          styles.mobileMenu,
          {
            transform: [{ translateX: slideAnim }],
          }
        ]}
      >
        <MenuContent />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  desktopMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    // Only show on larger screens
    display: width > 768 ? 'flex' : 'none',
  },
  mobileMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: height,
    width: MENU_WIDTH,
    backgroundColor: '#FAFAFA',
    borderRightWidth: 1,
    borderRightColor: '#000',
    paddingTop: 100,
    paddingHorizontal: 12,
    // Only show on mobile screens
    display: width <= 768 ? 'flex' : 'none',
    zIndex: 10,
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: width <= 768 ? '100%' : 'auto',
  },
  menuText: {
    fontSize: 16,
    color: '#000',
    textAlign: width <= 768 ? 'right' : 'center',
  },
});
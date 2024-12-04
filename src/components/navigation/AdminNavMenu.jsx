import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import { useAppStore } from '../../store/app';

const { width } = Dimensions.get('window');
const MENU_WIDTH = 150;

export default function AdminNavMenu({ isLoggedIn, isAdmin }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { menuOpen, setMenuOpen } = useAppStore();

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
    navigation.navigate(route);
  };

  const renderMenuItems = () => {
    const items = [];

    if (!isLoggedIn) {
      items.push(
        <TouchableOpacity 
          key="login"
          style={styles.menuItem} 
          onPress={() => handleNavigation('Login')}
        >
          <text style={styles.menuText}>{t("Log In")}</text>
        </TouchableOpacity>
      );
    }

    if (isAdmin) {
      items.push(
        <TouchableOpacity 
          key="backToSite"
          style={styles.menuItem} 
          onPress={() => handleNavigation('Home')}
        >
          <CustomText style={styles.menuText}>{t("Back to Site")}</CustomText>
        </TouchableOpacity>
      );
    }

    return items;
  };

  return (
    <>
      {/* Desktop Menu */}
      <View style={styles.desktopMenu}>
        {renderMenuItems()}
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
        {renderMenuItems()}
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
    paddingHorizontal: 20,
    height: 50,
    backgroundColor: '#FFFFFF',
    // Only show on larger screens
    display: width > 768 ? 'flex' : 'none',
  },
  mobileMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: MENU_WIDTH,
    backgroundColor: '#FAFAFA',
    borderRightWidth: 1,
    borderRightColor: '#000',
    paddingTop: 100,
    paddingHorizontal: 12,
    // Only show on mobile screens
    display: width <= 768 ? 'flex' : 'none',
    zIndex: 10,
    elevation: 5, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
    textAlign: width <= 768 ? 'right' : 'center',
  },
});
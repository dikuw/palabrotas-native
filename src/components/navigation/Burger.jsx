import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/app';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';
import NavMenu from './NavMenu';
import AdminNavMenu from './AdminNavMenu';

export default function Burger(props) {
  const { menuOpen, setMenuOpen } = useAppStore();
  const theme = useThemeStore(state => state.theme);
  const location = useLocation();
  const currentRoute = location.pathname;

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      zIndex: 999,
    },
    burger: {
      width: 32,
      height: 32,
      zIndex: 1000,
      justifyContent: 'space-around',
      flexDirection: 'column',
      alignItems: 'center',
    },
    menuContainer: {
      position: 'absolute',
      top: 40,
      left: 0,
      right: 0,
      backgroundColor: themes[theme].colors.background,
      zIndex: 998,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    line: {
      width: 32,
      height: 4,
      backgroundColor: themes[theme].colors.text,
      borderRadius: 10,
    },
    line1Open: {
      transform: [{ rotate: '45deg' }, { translateY: 14 }],
      position: 'absolute',
    },
    line2Open: {
      opacity: 0,
    },
    line3Open: {
      transform: [{ rotate: '-45deg' }, { translateY: -14 }],
      position: 'absolute',
    },
  });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.burger} onPress={toggleMenu}>
        <View style={[styles.line, menuOpen && styles.line1Open]} />
        <View style={[styles.line, menuOpen && styles.line2Open]} />
        <View style={[styles.line, menuOpen && styles.line3Open]} />
      </TouchableOpacity>
      {menuOpen && (
        <View style={styles.menuContainer}>
          {(currentRoute === "/admin" || currentRoute === "/contents") ? (
            <AdminNavMenu isLoggedIn={props.isLoggedIn} isAdmin={props.isAdmin} />
          ) : (
            <NavMenu isLoggedIn={props.isLoggedIn} isAdmin={props.isAdmin} logoutUser={props.logoutUser} />
          )}
        </View>
      )}
    </View>
  );
}
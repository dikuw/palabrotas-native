import React from 'react';
import { View, TouchableOpacity, StyleSheet, useWindowDimensions, Dimensions } from 'react-native';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/app';
import NavMenu from './NavMenu';
import AdminNavMenu from './AdminNavMenu';

export default function Burger(props) {
  const { width } = useWindowDimensions();
  const { menuOpen, setMenuOpen } = useAppStore();
  const location = useLocation();
  const currentRoute = location.pathname;

  const toggleMenu = () => {
    console.log('Menu toggled');
    setMenuOpen(!menuOpen);
  };

  if (width > 768) return null;

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
    top: 40, // Adjust this value based on your header height
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 998,
    elevation: 5, // for Android shadow
    shadowColor: '#000', // for iOS shadow
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
    backgroundColor: '#333',
    borderRadius: 10,
  },
  line1Open: {
    transform: [{ rotate: '45deg' }, { translateY: 14 }], // Add translateY
    position: 'absolute',
  },
  line2Open: {
    opacity: 0,
  },
  line3Open: {
    transform: [{ rotate: '-45deg' }, { translateY: -14 }], // Add translateY
    position: 'absolute',
  },
});
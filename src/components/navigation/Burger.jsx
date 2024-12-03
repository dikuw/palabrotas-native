import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/app';
import NavMenu from './NavMenu';
import AdminNavMenu from './AdminNavMenu';

const { width } = Dimensions.get('window');

export default function Burger(props) {
  const { menuOpen, setMenuOpen } = useAppStore();
  const location = useLocation();
  const currentRoute = location.pathname;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <TouchableOpacity style={styles.burger} onPress={toggleMenu}>
        <View style={[styles.line, menuOpen && styles.line1Open]} />
        <View style={[styles.line, menuOpen && styles.line2Open]} />
        <View style={[styles.line, menuOpen && styles.line3Open]} />
      </TouchableOpacity>
      {(currentRoute === "/admin" || currentRoute === "/contents") ? (
        <AdminNavMenu isLoggedIn={props.isLoggedIn} isAdmin={props.isAdmin} />
      ) : (
        <NavMenu isLoggedIn={props.isLoggedIn} isAdmin={props.isAdmin} logoutUser={props.logoutUser} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  burger: {
    width: 32,
    height: 32,
    zIndex: 20,
    display: 'none',
    justifyContent: 'space-around',
    flexDirection: 'column',
    alignItems: 'center',
    // Show burger on smaller screens
    display: width <= 768 ? 'flex' : 'none',
  },
  line: {
    width: 32,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 10,
    transition: 'all 0.3s linear',
  },
  line1Open: {
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
  },
  line2Open: {
    opacity: 0,
  },
  line3Open: {
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
  },
});
import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Platform, View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/theme';

const styles = StyleSheet.create({
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 20,
    marginRight: 8,
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default function Notification({ message, type = 'info', duration = 3000, onClose }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const theme = useThemeStore(state => state.theme);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'warning':
        return '#FFA726';
      default:
        return '#2196F3';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '!';
      default:
        return 'i';
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Animated.View
      style={[
        styles.notificationCard,
        {
          backgroundColor: getBackgroundColor(),
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.iconText}>{getIcon()}</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={handleClose}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
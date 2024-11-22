import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotificationCard = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  background-color: ${({ type, theme }) => 
    type === 'success' ? theme.colors.success :
    type === 'error' ? theme.colors.error :
    type === 'warning' ? theme.colors.warning :
    theme.colors.info};
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.25;
      shadow-radius: 3.84px;
    `,
    android: `
      elevation: 5;
    `
  })}
`;

const Message = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.regular}px;
  margin-right: ${({ theme }) => theme.spacing.small}px;
`;

const CloseButton = styled.TouchableOpacity`
  padding: ${({ theme }) => theme.spacing.small}px;
`;

export default function Notification({ message, type = 'info', duration = 3000, onClose }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    // Fade in
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

    // Auto dismiss
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

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <NotificationCard
      type={type}
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      <Icon 
        name={getIconName()} 
        size={24} 
        color="white" 
        style={{ marginRight: 8 }}
      />
      <Message>{message}</Message>
      <CloseButton onPress={handleClose}>
        <Icon name="close" size={24} color="white" />
      </CloseButton>
    </NotificationCard>
  );
}
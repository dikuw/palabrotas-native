import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

const NotificationCard = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  background-color: ${({ type, theme }) => 
    type === 'success' ? '#4CAF50' :
    type === 'error' ? '#F44336' :
    type === 'warning' ? '#FFA726' :
    '#2196F3'};
  opacity: 1;
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
  color: #FFFFFF;
  font-size: ${({ theme }) => theme.typography.regular}px;
  margin-right: ${({ theme }) => theme.spacing.small}px;
  font-weight: bold;
`;

const IconText = styled.Text`
  color: #FFFFFF;
  font-size: 20px;
  margin-right: 8px;
`;

const CloseText = styled.Text`
  color: #FFFFFF;
  font-size: 20px;
  font-weight: bold;
`;

export default function Notification({ message, type = 'info', duration = 3000, onClose }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

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
    <NotificationCard
      type={type}
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      <IconText>{getIcon()}</IconText>
      <Message>{message}</Message>
      <TouchableOpacity onPress={handleClose}>
        <CloseText>×</CloseText>
      </TouchableOpacity>
    </NotificationCard>
  );
}
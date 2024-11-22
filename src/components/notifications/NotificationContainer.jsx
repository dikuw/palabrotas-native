import React from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';
import { useNotificationStore } from '../../store/notification';
import Notification from './Notification';

const Container = styled.View`
  position: absolute;
  top: ${Platform.OS === 'ios' ? 50 : 20}px;
  left: 0;
  right: 0;
  z-index: 1000;
  align-items: center;
`;

const NotificationWrapper = styled(Animated.View)`
  width: 90%;
  max-width: 400px;
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
`;

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <Container>
      {notifications.map(({ id, message, type, duration }) => (
        <NotificationWrapper key={id}>
          <Notification
            message={message}
            type={type}
            duration={duration}
            onClose={() => removeNotification(id)}
          />
        </NotificationWrapper>
      ))}
    </Container>
  );
}
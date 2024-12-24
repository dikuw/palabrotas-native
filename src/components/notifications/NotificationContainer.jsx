import React from 'react';
import { Animated, Platform, View, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';
import { useNotificationStore } from '../../store/notification';
import Notification from './Notification';

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationStore();
  const theme = useThemeStore(state => state.theme);

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 50 : 20,
      left: 0,
      right: 0,
      zIndex: 500,
      alignItems: 'center',
    },
    notificationWrapper: {
      width: '90%',
      maxWidth: 400,
      marginBottom: 8,
      zIndex: 500,
    }
  });

  return (
    <View style={styles.container}>
      {notifications.map(({ id, message, type, duration }) => (
        <Animated.View key={id} style={styles.notificationWrapper}>
          <Notification
            message={message}
            type={type}
            duration={duration}
            onClose={() => removeNotification(id)}
          />
        </Animated.View>
      ))}
    </View>
  );
}
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

export default function LoggingOut() {
  const theme = useThemeStore(state => state.theme);

  const styles = {
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themes[theme].colors.background,
    },
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={themes[theme].colors.primary} />
    </View>
  );
}

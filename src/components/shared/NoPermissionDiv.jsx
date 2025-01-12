import React from 'react';
import { View, Text } from 'react-native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

export default function NoPermission({ message }) {
  const theme = useThemeStore(state => state.theme);

  const styles = {
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: themes[theme].spacing.large,
    },
    text: {
      fontSize: themes[theme].typography.regular,
      color: themes[theme].colors.text,
      textAlign: 'center',
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
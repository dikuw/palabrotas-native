import React from 'react';
import { View, Text } from 'react-native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

export default function Banner({ title }) {
  const theme = useThemeStore(state => state.theme);

  const styles = {
    container: {
      padding: themes[theme].spacing.medium,
      margin: `${themes[theme].spacing.medium}px 0`,
      backgroundColor: themes[theme].colors.primary,
      borderRadius: themes[theme].borderRadius.medium,
    },
    text: {
      color: themes[theme].colors.white,
      fontSize: themes[theme].typography.large,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}
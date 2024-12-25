import React from 'react';
import { View, Text } from 'react-native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

export default function Streak({ currentStreak, longestStreak }) {
  const theme = useThemeStore(state => state.theme);

  const styles = {
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: themes[theme].spacing.medium,
      backgroundColor: themes[theme].colors.background,
      borderRadius: themes[theme].borderRadius.medium,
      marginBottom: themes[theme].spacing.medium,
      borderWidth: 1,
      borderColor: themes[theme].colors.border,
    },
    streakBox: {
      alignItems: 'center',
    },
    streakNumber: {
      fontSize: themes[theme].typography.xlarge,
      fontWeight: 'bold',
      color: themes[theme].colors.primary,
    },
    streakLabel: {
      fontSize: themes[theme].typography.regular,
      color: themes[theme].colors.text,
      marginTop: themes[theme].spacing.small,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.streakBox}>
        <Text style={styles.streakNumber}>{currentStreak}</Text>
        <Text style={styles.streakLabel}>Current Streak</Text>
      </View>
      <View style={styles.streakBox}>
        <Text style={styles.streakNumber}>{longestStreak}</Text>
        <Text style={styles.streakLabel}>Longest Streak</Text>
      </View>
    </View>
  );
}
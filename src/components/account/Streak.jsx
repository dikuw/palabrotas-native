import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';
import Spinner from '../shared/Spinner';

export default function Streak({ currentStreak, longestStreak, isCurrentStreakLoading, isLongestStreakLoading }) {
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);

  const styles = {
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
      backgroundColor: themes[theme].colors.background,
    },
    streakBox: {
      alignItems: 'center',
    },
    streakNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: themes[theme].colors.text,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    streakLabel: {
      fontSize: 16,
      color: themes[theme].colors.text,
      marginTop: 5,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.streakBox}>
        <View style={styles.streakNumber}>
          {isCurrentStreakLoading ? (
            <Spinner size={24} />
          ) : (
            <Text style={styles.streakNumber}>{currentStreak}</Text>
          )}
        </View>
        <Text style={styles.streakLabel}>{t("Current Streak")}</Text>
      </View>
      <View style={styles.streakBox}>
        <View style={styles.streakNumber}>
          {isLongestStreakLoading ? (
            <Spinner size={24} />
          ) : (
            <Text style={styles.streakNumber}>{longestStreak}</Text>
          )}
        </View>
        <Text style={styles.streakLabel}>{t("Longest Streak")}</Text>
      </View>
    </View>
  );
}
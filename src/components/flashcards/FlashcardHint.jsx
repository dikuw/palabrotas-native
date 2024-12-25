import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

export default function FormattedHint({ hint }) {
  const theme = useThemeStore(state => state.theme);

  const styles = StyleSheet.create({
    hintContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 24,
      marginVertical: 10,
    },
    hintCharacter: {
      width: 16,
      height: 24,
      marginHorizontal: 2,
      borderBottomWidth: 2,
      borderBottomColor: themes[theme].colors.text,
      alignItems: 'center',
      justifyContent: 'center',
    },
    hintSpace: {
      width: 16,
    },
    characterText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: themes[theme].colors.text,
    },
  });

  return (
    <View style={styles.hintContainer}>
      {hint.split('').map((char, index) => {
        if (char === '_') {
          return <View key={index} style={styles.hintCharacter} />;
        } else if (char === ' ') {
          return <View key={index} style={styles.hintSpace} />;
        } else {
          return (
            <View key={index} style={styles.hintCharacter}>
              <Text style={styles.characterText}>{char}</Text>
            </View>
          );
        }
      })}
    </View>
  );
}
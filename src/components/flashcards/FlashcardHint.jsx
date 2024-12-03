import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FormattedHint({ hint }) {
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

const styles = StyleSheet.create({
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 24, // converted from 1.5em
    marginVertical: 10,
  },
  hintCharacter: {
    width: 16, // converted from 1em
    height: 24, // converted from 1.5em
    marginHorizontal: 2,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintSpace: {
    width: 16, // converted from 1em
  },
  characterText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
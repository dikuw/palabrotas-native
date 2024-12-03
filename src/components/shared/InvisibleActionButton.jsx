import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function InvisibleActionButton({ clickHandler, buttonLabel }) {
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={clickHandler}
    >
      <Text style={styles.buttonText}>{buttonLabel}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: '100%',
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: '400',
    color: '#8B0000', // Equivalent to var(--vinoTinto)
    letterSpacing: 1,
  },
});
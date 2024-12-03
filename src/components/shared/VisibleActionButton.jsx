import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function VisibleActionButton({ clickHandler, buttonLabel }) {
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={clickHandler}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{buttonLabel}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF', // iOS primary blue, adjust to match your --primary color
    borderRadius: 4,
    height: 45,
    paddingHorizontal: 25,
    marginVertical: 4,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: '400',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
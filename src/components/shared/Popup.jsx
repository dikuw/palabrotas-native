import React from 'react';
import { View, Text, Image, StyleSheet, Modal } from 'react-native';

export default function Popup({ visible, popupText }) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <View style={styles.popupHeader}>
            <Text style={styles.popupText}>{popupText}</Text>
            <Image
              source={require('../../assets/images/spinner.gif')}
              style={styles.spinner}
              alt="uploading"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popupContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  popupHeader: {
    alignItems: 'center',
  },
  popupText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  spinner: {
    width: 56, // Adjust size as needed
    height: 56,
  },
});
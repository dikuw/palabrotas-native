import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';
import Spinner from './Spinner';

export default function Popup({ visible, popupText }) {
  const theme = useThemeStore(state => state.theme);

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    popupContainer: {
      width: '80%',
      backgroundColor: themes[theme].colors.background,
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
      color: themes[theme].colors.text,
    },
  });

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
            <Spinner size={56} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
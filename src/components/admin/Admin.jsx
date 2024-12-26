import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

export default function Admin() {
  const navigation = useNavigation();
  const theme = useThemeStore(state => state.theme);

  const styles = {
    container: {
      flex: 1,
      width: '90%',
      maxWidth: 1000,
      marginVertical: 30,
      marginHorizontal: 'auto',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themes[theme].colors.background,
    },
    backButton: {
      padding: themes[theme].spacing.medium,
      backgroundColor: themes[theme].colors.primary,
      borderRadius: themes[theme].borderRadius.medium,
    },
    buttonText: {
      color: themes[theme].colors.white,
      fontSize: themes[theme].typography.regular,
    },
  };

  const goBack = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={goBack}
      >
        <Text style={styles.buttonText}>Back to Site</Text>
      </TouchableOpacity>
    </View>
  );
}
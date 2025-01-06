import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';
import { View, Text } from 'react-native';

export default function NoResults() {
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);

  const styles = {
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: themes[theme].spacing.xlarge,
    },
    message: {
      fontSize: themes[theme].typography.large,
      color: themes[theme].colors.text,
      textAlign: 'center',
      marginTop: themes[theme].spacing.medium,
    },
  };

  return (
    <View style={styles.container}>
      <Icon 
        name="search-minus" 
        size={48} 
        color={themes[theme].colors.text} 
      />
      <Text style={styles.message}>{t("No results found")}</Text>
    </View>
  );
}
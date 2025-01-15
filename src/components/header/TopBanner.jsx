import React from 'react';
import { useTranslation } from "react-i18next";
import { View, Text } from 'react-native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

export default function TopBanner(props) {
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);

  const styles = {
    container: {
      width: '100%',
      backgroundColor: themes[theme].colors.primary,
      padding: 7,
      paddingHorizontal: 10,
    },
    text: {
      color: themes[theme].colors.white,
      textAlign: 'center',
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {t("Welcome")} {t(props.name)}!
      </Text>
    </View>
  );
}
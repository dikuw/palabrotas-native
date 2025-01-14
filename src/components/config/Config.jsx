import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';

export default function Config({ isLoggedIn, logoutUser }) {
  const { t, i18n } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const setTheme = useThemeStore(state => state.setTheme);
  const navigation = useNavigation();
  
  // Set default language if none is selected
  useEffect(() => {
    if (!i18n.language) {
      i18n.changeLanguage('en');
    }
  }, [i18n]);

  const styles = {
    container: {
      flex: 1,
      backgroundColor: themes[theme].colors.background,
      padding: themes[theme].spacing.large,
    },
    title: {
      fontSize: themes[theme].typography.xlarge,
      fontWeight: 'bold',
      color: themes[theme].colors.primary,
      marginBottom: themes[theme].spacing.large,
    },
    section: {
      marginBottom: themes[theme].spacing.large,
    },
    sectionTitle: {
      fontSize: themes[theme].typography.medium,
      fontWeight: 'bold',
      color: themes[theme].colors.text,
      marginBottom: themes[theme].spacing.medium,
    },
    optionButton: (isSelected) => ({
      flexDirection: 'row',
      alignItems: 'center',
      padding: themes[theme].spacing.medium,
      backgroundColor: isSelected ? themes[theme].colors.primary : themes[theme].colors.almostWhite,
      borderRadius: themes[theme].borderRadius.medium,
      marginBottom: themes[theme].spacing.small,
    }),
    optionText: (isSelected) => ({
      fontSize: themes[theme].typography.medium,
      color: isSelected ? themes[theme].colors.white : themes[theme].colors.text,
    }),
    logoutButton: {
      margin: themes[theme].spacing.small,
      padding: themes[theme].spacing.small,
      backgroundColor: themes[theme].colors.secondary,
      borderRadius: 20,
      alignItems: 'center',
      alignSelf: 'center',
      minWidth: 200,
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: themes[theme].spacing.large,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#ffffff',
      marginLeft: 5,
    },
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  const themeOptions = [
    { id: 'light', name: t('Light') },
    { id: 'dark', name: t('Dark') }
  ];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  const handleThemeChange = (themeId) => {
    setTheme(themeId);
  };

  const handleLogout = async () => {
    try {
      // Navigate to logging out screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoggingOut' }],
      });
      
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Perform logout
      await logoutUser();
      
      // Navigate to Home (which will show Intro1 since we're logged out)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("Settings")}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("Language")}</Text>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={styles.optionButton(i18n.language?.startsWith(language.code))}
            onPress={() => handleLanguageChange(language.code)}
          >
            <Text style={styles.optionText(i18n.language?.startsWith(language.code))}>
              {language.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("Theme")}</Text>
        {themeOptions.map((themeOption) => (
          <TouchableOpacity
            key={themeOption.id}
            style={styles.optionButton(theme === themeOption.id)}
            onPress={() => handleThemeChange(themeOption.id)}
          >
            <Text style={styles.optionText(theme === themeOption.id)}>
              {themeOption.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoggedIn && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('Logout')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
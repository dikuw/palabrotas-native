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
    outerContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      padding: themes[theme].spacing.large,
      paddingTop: 0,
    },
    formContainer: {
      width: '99%',
      maxWidth: 800,
      marginHorizontal: 'auto',
      marginTop: themes[theme].spacing.small,
      marginBottom: themes[theme].spacing.medium,
      backgroundColor: themes[theme].colors.white,
      borderRadius: 9,
      borderWidth: 1,
      borderColor: '#000',
      padding: themes[theme].spacing.large,
      alignSelf: 'center',
    },
    title: {
      fontSize: themes[theme].typography.large,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: themes[theme].spacing.large,
      textAlign: 'center',
    },
    section: {
      marginBottom: themes[theme].spacing.large,
    },
    sectionTitle: {
      fontSize: themes[theme].typography.medium,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: themes[theme].spacing.medium,
    },
    optionButton: (isSelected) => ({
      flexDirection: 'row',
      alignItems: 'center',
      padding: themes[theme].spacing.medium,
      backgroundColor: isSelected ? themes[theme].colors.secondary : themes[theme].colors.white,
      borderRadius: 24,
      borderWidth: 2,
      borderColor: themes[theme].colors.secondary,
      marginBottom: themes[theme].spacing.small,
    }),
    optionText: (isSelected) => ({
      fontSize: themes[theme].typography.medium,
      color: isSelected ? themes[theme].colors.white : '#000000',
    }),
    logoutButton: {
      padding: themes[theme].spacing.small,
      paddingHorizontal: themes[theme].spacing.medium,
      borderRadius: 24,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: themes[theme].colors.error,
      alignItems: 'center',
      backgroundColor: 'transparent',
      marginTop: themes[theme].spacing.large,
    },
    logoutText: {
      color: themes[theme].colors.error,
      fontSize: themes[theme].typography.regular,
      fontWeight: 'bold',
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
    <View style={styles.outerContainer}>
      <View style={styles.formContainer}>
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
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>{t('Logout')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
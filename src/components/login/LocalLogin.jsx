import React, { useState } from 'react';
import { ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

import { useAuthStore } from '../../store/auth';
import { useNotificationStore } from '../../store/notification';
import GoogleLogin from './GoogleLogin';

export default function LocalLogin() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const { loginUser } = useAuthStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    input: (hasError) => ({
      backgroundColor: '#FFF',
      color: '#000000',
      padding: themes[theme].spacing.medium,
      marginBottom: themes[theme].spacing.small,
      borderRadius: 24,
      fontSize: themes[theme].typography.regular,
      borderWidth: 2,
      borderColor: hasError ? themes[theme].colors.error : themes[theme].colors.primary,
      height: 55,
      textAlignVertical: 'center',
    }),
    title: {
      fontSize: themes[theme].typography.large,
      fontWeight: 'bold',
      color: themes[theme].colors.text,
      marginBottom: themes[theme].spacing.large,
      textAlign: 'center',
    },
    errorText: {
      color: themes[theme].colors.error,
      fontSize: themes[theme].typography.small,
      marginBottom: themes[theme].spacing.small,
    },
    button: (isSecondary) => ({
      padding: themes[theme].spacing.small,
      paddingHorizontal: themes[theme].spacing.medium,
      borderRadius: 24,
      borderWidth: isSecondary ? 1 : 0,
      borderStyle: 'dashed',
      borderColor: '#000',
      alignItems: 'center',
      backgroundColor: isSecondary ? themes[theme].colors.white : themes[theme].colors.secondary,
      marginTop: themes[theme].spacing.medium,
    }),
    buttonText: (isSecondary) => ({
      color: isSecondary ? themes[theme].colors.text : themes[theme].colors.white,
      fontSize: themes[theme].typography.regular,
      fontWeight: 'bold',
    }),
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: themes[theme].spacing.large,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: themes[theme].colors.border,
    },
    dividerText: {
      color: themes[theme].colors.textSecondary,
      marginHorizontal: themes[theme].spacing.medium,
      fontSize: themes[theme].typography.small,
    },
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = t("Please provide your email");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("Please provide a valid email");
    }
    if (!formData.password) newErrors.password = t("Password cannot be blank");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const result = await loginUser(formData);
        if (result.user.email) {
          navigation.navigate('Home');
          addNotification(t('Logged in successfully!'), 'success');
        }
      } catch (error) {
        setErrors({ general: error.message || t('Login failed. Please try again.') });
        addNotification(t('Login failed. Please try again.'), 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.outerContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{t("Login")}</Text>

          <TextInput
            style={styles.input(!!errors.email)}
            placeholder={t("Email")}
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholderTextColor={themes[theme].colors.textSecondary}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={styles.input(!!errors.password)}
            placeholder={t("Password")}
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            placeholderTextColor={themes[theme].colors.textSecondary}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TouchableOpacity 
            style={styles.button(false)}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.7}
          >
            {isSubmitting ? (
              <ActivityIndicator color={themes[theme].colors.white} />
            ) : (
              <Text style={styles.buttonText(false)}>{t("Log in")}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button(true)}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText(true)}>
              {t("No account? Register here!")}
            </Text>
          </TouchableOpacity>

          {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t("or")}</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleLogin />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
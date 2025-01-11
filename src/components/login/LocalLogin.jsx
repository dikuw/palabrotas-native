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
    keyboardView: {
      flex: 1,
      backgroundColor: themes[theme].colors.background,
    },
    scrollView: {
      flex: 1,
      backgroundColor: themes[theme].colors.background,
    },
    container: {
      flex: 1,
      width: '90%',
      maxWidth: 500,
      margin: 0,
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: themes[theme].spacing.large,
      backgroundColor: themes[theme].colors.background,
    },
    title: {
      fontSize: themes[theme].typography.xlarge,
      fontWeight: 'bold',
      color: themes[theme].colors.text,
      textAlign: 'center',
      marginBottom: themes[theme].spacing.large,
    },
    input: (hasError) => ({
      backgroundColor: hasError ? `${themes[theme].colors.error}20` : themes[theme].colors.white,
      color: hasError ? themes[theme].colors.error : '#000000',
      padding: themes[theme].spacing.medium,
      marginBottom: themes[theme].spacing.small,
      borderRadius: themes[theme].borderRadius.medium,
      fontSize: themes[theme].typography.regular,
      borderWidth: 1,
      borderColor: themes[theme].colors.border,
    }),
    errorText: {
      color: themes[theme].colors.error,
      fontSize: themes[theme].typography.small,
      marginBottom: themes[theme].spacing.small,
    },
    button: (variant) => ({
      backgroundColor: variant === 'secondary' ? 'transparent' : themes[theme].colors.primary,
      padding: themes[theme].spacing.medium,
      borderRadius: themes[theme].borderRadius.medium,
      alignItems: 'center',
      marginTop: themes[theme].spacing.medium,
      opacity: isSubmitting ? 0.5 : 1,
      borderWidth: 1,
      borderColor: themes[theme].colors.border,
    }),
    buttonText: (variant) => ({
      color: variant === 'secondary' ? themes[theme].colors.primary : themes[theme].colors.white,
      fontSize: themes[theme].typography.medium,
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
      style={styles.keyboardView}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
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
            style={styles.button()}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.7}
          >
            {isSubmitting ? (
              <ActivityIndicator color={themes[theme].colors.white} />
            ) : (
              <Text style={styles.buttonText()}>{t("Log in")}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button('secondary')}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText('secondary')}>
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
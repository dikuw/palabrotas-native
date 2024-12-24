import React, { useState } from 'react';
import { ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

import { useAuthStore } from '../../store/auth';
import { useNotificationStore } from '../../store/notification';

export default function Register() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const { registerUser } = useAuthStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      color: hasError ? themes[theme].colors.error : themes[theme].colors.text,
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
      borderWidth: variant === 'secondary' ? 1 : 0,
      borderColor: themes[theme].colors.primary,
    }),
    buttonText: (variant) => ({
      color: variant === 'secondary' ? themes[theme].colors.primary : themes[theme].colors.white,
      fontSize: themes[theme].typography.medium,
      fontWeight: 'bold',
    }),
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = t("Please provide your name");
    if (!formData.email) {
      newErrors.email = t("Please provide your email");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("Please provide a valid email");
    }
    if (!formData.password) {
      newErrors.password = t("Password cannot be blank");
    } else if (formData.password.length < 8) {
      newErrors.password = t("Password must be at least 8 characters long");
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("Confirm Password cannot be blank");
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = t("Passwords do not match");
      newErrors.confirmPassword = t("Passwords do not match");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const result = await registerUser(formData);
        if (result.user.email) {
          navigation.navigate('Home');
          addNotification(t('Registration successful!'), 'success');
        }
      } catch (error) {
        setErrors({ general: error.message || t('Registration failed. Please try again.') });
        addNotification(t('Registration failed. Please try again.'), 'error');
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
          <Text style={styles.title}>{t("Create Account")}</Text>

          <TextInput
            style={styles.input(!!errors.name)}
            placeholder={t("Name")}
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            autoCapitalize="words"
            autoComplete="name"
            placeholderTextColor={themes[theme].colors.textSecondary}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

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
            autoComplete="password-new"
            placeholderTextColor={themes[theme].colors.textSecondary}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TextInput
            style={styles.input(!!errors.confirmPassword)}
            placeholder={t("Confirm Password")}
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            placeholderTextColor={themes[theme].colors.textSecondary}
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          <TouchableOpacity 
            style={styles.button()}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.7}
          >
            {isSubmitting ? (
              <ActivityIndicator color={themes[theme].colors.white} />
            ) : (
              <Text style={styles.buttonText()}>{t("Register")}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button('secondary')}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText('secondary')}>{t("Back to Login")}</Text>
          </TouchableOpacity>

          {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
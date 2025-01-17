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
      color: themes[theme].colors.text,
      marginBottom: themes[theme].spacing.large,
      textAlign: 'center',
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
    errorText: {
      color: themes[theme].colors.error,
      fontSize: themes[theme].typography.small,
      marginBottom: themes[theme].spacing.small,
    },
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
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.outerContainer}>
        <View style={styles.formContainer}>
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
            style={styles.button(false)}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.7}
          >
            {isSubmitting ? (
              <ActivityIndicator color={themes[theme].colors.white} />
            ) : (
              <Text style={styles.buttonText(false)}>{t("Register")}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button(true)}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText(true)}>{t("Back to Login")}</Text>
          </TouchableOpacity>

          {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
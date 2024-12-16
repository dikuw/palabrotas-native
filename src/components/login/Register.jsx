import React, { useState } from 'react';
import { ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import styled, { useTheme } from 'styled-components/native';

import { useAuthStore } from '../../store/auth';
import { useNotificationStore } from '../../store/notification';

const Container = styled.View`
  flex: 1;
  width: 90%;
  max-width: 500px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.xlarge}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

const Input = styled.TextInput`
  background-color: ${({ hasError, theme }) => 
    hasError ? theme.colors.error + '20' : theme.colors.white};
  color: ${({ hasError, theme }) => 
    hasError ? theme.colors.error : theme.colors.text};
  padding: ${({ theme }) => theme.spacing.medium}px;
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  font-size: ${({ theme }) => theme.typography.regular}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.small}px;
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${({ variant, theme }) => 
    variant === 'secondary' ? 'transparent' : theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.medium}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.medium}px;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

const ButtonText = styled.Text`
  color: ${({ variant, theme }) => 
    variant === 'secondary' ? theme.colors.primary : theme.colors.white};
  font-size: ${({ theme }) => theme.typography.medium}px;
  font-weight: bold;
`;

export default function Register() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
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
      <ScrollView>
        <Container>
          <Title>{t("Create Account")}</Title>

          <Input
            placeholder={t("Name")}
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            hasError={!!errors.name}
            autoCapitalize="words"
            autoComplete="name"
          />
          {errors.name && <ErrorText>{errors.name}</ErrorText>}

          <Input
            placeholder={t("Email")}
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            hasError={!!errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}

          <Input
            placeholder={t("Password")}
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
            hasError={!!errors.password}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}

          <Input
            placeholder={t("Confirm Password")}
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            hasError={!!errors.confirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
          />
          {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}

          <Button 
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.7}
          >
            {isSubmitting ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <ButtonText>{t("Register")}</ButtonText>
            )}
          </Button>

          <Button 
            variant="secondary"
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <ButtonText variant="secondary">{t("Back to Login")}</ButtonText>
          </Button>

          {errors.general && <ErrorText>{errors.general}</ErrorText>}
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
import React, { useState } from 'react';
import { ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import styled from 'styled-components/native';

import { useAuthStore } from '../../store/auth';
import { useNotificationStore } from '../../store/notification';
import GoogleLogin from './GoogleLogin';

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
    hasError ? theme.colors.error + '20' : theme.colors.inputBackground};
  color: ${({ hasError, theme }) => 
    hasError ? theme.colors.error : theme.colors.text};
  padding: ${({ theme }) => theme.spacing.medium}px;
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  font-size: ${({ theme }) => theme.typography.regular}px;
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

const OrDivider = styled.View`
  flex-direction: row;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.large}px 0;
`;

const DividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
`;

const DividerText = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 ${({ theme }) => theme.spacing.medium}px;
  font-size: ${({ theme }) => theme.typography.small}px;
`;

export default function LocalLogin() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { loginUser } = useAuthStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <ScrollView>
        <Container>
          <Title>{t("Login")}</Title>

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
            autoComplete="password"
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}

          <Button 
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.7}
          >
            {isSubmitting ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <ButtonText>{t("Log in")}</ButtonText>
            )}
          </Button>

          <Button 
            variant="secondary"
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.7}
          >
            <ButtonText variant="secondary">
              {t("No account? Register here!")}
            </ButtonText>
          </Button>

          {errors.general && <ErrorText>{errors.general}</ErrorText>}

          <OrDivider>
            <DividerLine />
            <DividerText>{t("or")}</DividerText>
            <DividerLine />
          </OrDivider>

          <GoogleLogin />

          {/* Forgot Password - Uncomment when ready to implement
          <Button 
            variant="secondary"
            onPress={() => navigation.navigate('ForgotPassword')}
            activeOpacity={0.7}
          >
            <ButtonText variant="secondary">
              {t("Forgot Password?")}
            </ButtonText>
          </Button>
          */}
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import styled from 'styled-components/native';

import { useFeedbackStore } from '../../store/feedback';
import { useNotificationStore } from '../../store/notification';

const Container = styled.View`
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.medium}px;
`;

const Form = styled.View`
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
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.1;
      shadow-radius: 3px;
    `,
    android: `
      elevation: 3;
    `
  })}
`;

const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.small}px;
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.medium}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  align-items: center;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.medium}px;
  font-weight: bold;
`;

export default function AddFeedback() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { addFeedback } = useFeedbackStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = t("Please provide your name.");
    if (!formData.email) {
      newErrors.email = t("Please provide your email.");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("Please provide a valid email.");
    }
    if (!formData.message) newErrors.message = t("Message cannot be blank.");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const result = await addFeedback(formData);
        if (result.success) {
          navigation.navigate('Home');
          addNotification(t('Feedback submitted successfully!'), 'success');
        }
      } catch (error) {
        setErrors({ 
          general: error.message || t('Feedback submission failed. Please try again.') 
        });
        addNotification(t('Feedback submission failed. Please try again.'), 'error');
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
          <Form>
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
              placeholder={t("Message")}
              value={formData.message}
              onChangeText={(text) => handleChange('message', text)}
              hasError={!!errors.message}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.message && <ErrorText>{errors.message}</ErrorText>}

            <SubmitButton 
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <ButtonText>{t("Submit")}</ButtonText>
              )}
            </SubmitButton>

            {errors.general && <ErrorText>{errors.general}</ErrorText>}
          </Form>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

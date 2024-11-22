import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import styled from 'styled-components/native';

import { useAuthStore } from '../../store/auth';
import { useTagStore } from '../../store/tag';
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

const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.small}px;
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
`;

export default function AddTag() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { authStatus } = useAuthStore();
  const { MAX_TAG_LENGTH, addTag } = useTagStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const [formData, setFormData] = useState({
    name: "",
    owner: authStatus.user?._id
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = t("Please enter a name.");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!authStatus.isLoggedIn || !authStatus.user?._id) {
      addNotification(t('Please log in to add a tag'), 'info');
      return;
    }

    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const tagData = {
          ...formData,
          owner: authStatus.user._id
        };

        const result = await addTag(tagData);
        if (result) {
          navigation.navigate("Home");
          addNotification(t('Added successfully'), 'success');
        }
      } catch (error) {
        setErrors({ 
          general: error.message || t('Adding tag failed. Please try again.') 
        });
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
      <Container>
        <Form>
          <Input
            name="name"
            placeholder={errors.name || t("tag")}
            value={errors.name ? "" : formData.name}
            onChangeText={(text) => handleChange('name', text)}
            hasError={!!errors.name}
            maxLength={MAX_TAG_LENGTH}
            autoCapitalize="none"
          />
          {errors.name && <ErrorText>{errors.name}</ErrorText>}

          <SubmitButton 
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.7}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <ButtonText>{t("Add Tag")}</ButtonText>
            )}
          </SubmitButton>

          {errors.general && <ErrorText>{errors.general}</ErrorText>}
        </Form>
      </Container>
    </KeyboardAvoidingView>
  );
}
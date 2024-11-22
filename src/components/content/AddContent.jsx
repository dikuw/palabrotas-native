import React, { useState } from 'react';
import { ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import styled from 'styled-components/native';
import DropDownPicker from 'react-native-dropdown-picker';

import { useAuthStore } from '../../store/auth';
import { useContentStore } from '../../store/content';
import { useNotificationStore } from '../../store/notification';
import { countries } from '../shared/countries';

const Container = styled.View`
  flex: 1;
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

const FormContainer = styled.View`
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

const SubmitButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.medium}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.large}px;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.medium}px;
  font-weight: bold;
`;

export default function AddContent() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { authStatus } = useAuthStore();
  const { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, addContent } = useContentStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    country: "",
    hint: "",
    exampleSentence: "",
    owner: authStatus.user ? authStatus.user._id : "66f97a0ef1de0db4e4c254eb",
    author: authStatus.user ? authStatus.user.name : "Anonymous",
  });

  const [errors, setErrors] = useState({});
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title) newErrors.title = t("Please enter a title");
    if (!formData.description) newErrors.description = t("Please enter a description");
    if (!formData.country) newErrors.country = t("Please select a country");
    if (!formData.author) newErrors.author = t("Please enter an author");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const result = await addContent(formData);
        if (result) {
          navigation.navigate('Home');
          addNotification(t('Added successfully'), 'success');
        }
      } catch (error) {
        setErrors({ general: error.message || t('Adding content failed. Please try again.') });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const countryItems = countries.map(country => ({
    label: t(country.name),
    value: country.code
  }));

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <Container>
          <FormContainer>
            <Input
              placeholder={t("Title")}
              value={formData.title}
              onChangeText={(text) => handleChange('title', text)}
              hasError={!!errors.title}
              maxLength={MAX_TITLE_LENGTH}
            />
            {errors.title && <ErrorText>{errors.title}</ErrorText>}

            <Input
              placeholder={t("Description")}
              value={formData.description}
              onChangeText={(text) => handleChange('description', text)}
              hasError={!!errors.description}
              maxLength={MAX_DESCRIPTION_LENGTH}
              multiline
              numberOfLines={3}
            />
            {errors.description && <ErrorText>{errors.description}</ErrorText>}

            <DropDownPicker
              open={isCountryOpen}
              setOpen={setIsCountryOpen}
              value={formData.country}
              items={countryItems}
              setValue={(callback) => {
                const value = callback(formData.country);
                handleChange('country', value);
              }}
              placeholder={t("Select a country")}
              style={{
                backgroundColor: errors.country ? theme.colors.error + '20' : theme.colors.inputBackground,
                borderColor: errors.country ? theme.colors.error : theme.colors.border,
                marginBottom: 10
              }}
              dropDownContainerStyle={{
                borderColor: theme.colors.border
              }}
              zIndex={3000}
            />
            {errors.country && <ErrorText>{errors.country}</ErrorText>}

            <Input
              placeholder={t("Author")}
              value={formData.author}
              onChangeText={(text) => handleChange('author', text)}
              hasError={!!errors.author}
            />
            {errors.author && <ErrorText>{errors.author}</ErrorText>}

            <Input
              placeholder={t("Hint (optional)")}
              value={formData.hint}
              onChangeText={(text) => handleChange('hint', text)}
            />

            <Input
              placeholder={t("Example sentence (optional)")}
              value={formData.exampleSentence}
              onChangeText={(text) => handleChange('exampleSentence', text)}
              multiline
              numberOfLines={2}
            />

            <SubmitButton 
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              <ButtonText>
                {isSubmitting ? t("Adding...") : t("Add Content")}
              </ButtonText>
            </SubmitButton>

            {errors.general && <ErrorText>{errors.general}</ErrorText>}
          </FormContainer>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
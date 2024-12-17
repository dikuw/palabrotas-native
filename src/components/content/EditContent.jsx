import React, { useState, useEffect } from 'react';
import { ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import styled, { useTheme } from 'styled-components/native';
import DropDownPicker from 'react-native-dropdown-picker';

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
    variant === 'delete' ? theme.colors.error : theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.medium}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.medium}px;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.medium}px;
  font-weight: bold;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function EditContent({ route }) {
  const { contentId } = route.params;
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  const { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, contents, getContents, updateContent, deleteContent } = useContentStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    country: "",
    hint: "",
    exampleSentence: "",
    author: "",
  });

  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState({});
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const contentItem = contents.find(item => item._id === contentId);
    if (contentItem) {
      setFormData({
        id: contentItem._id,
        title: contentItem.title,
        description: contentItem.description,
        country: contentItem.country,
        hint: contentItem.hint || "",
        exampleSentence: contentItem.exampleSentence || "",
        author: contentItem.author || "",
      });
      setIsLoading(false);
    }
  }, [contentId, contents]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setIsDirty(true);
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
        const result = await updateContent(formData);
        if (result) {
          await getContents();
          setIsDirty(false);
          navigation.navigate('Home');
          addNotification(t('Updated successfully'), 'success');
        }
      } catch (error) {
        setErrors({ general: error.message || t('Updating content failed. Please try again.') });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const result = await deleteContent(formData);
      if (result) {
        await getContents();
        navigation.navigate('Home');
        addNotification(t('Deleted successfully'), 'success');
      }
    } catch (error) {
      setErrors({ general: error.message || t('Deleting content failed. Please try again.') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const countryItems = countries.map(country => ({
    label: t(country.name),
    value: country.code
  }));

  if (isLoading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </LoadingContainer>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <FlatList
        data={[{ key: 'form' }]}
        renderItem={() => (
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
                listMode="SCROLLVIEW" // Add this line
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
  
              <Button 
                onPress={handleSubmit}
                disabled={!isDirty || isSubmitting}
                activeOpacity={0.7}
            >
              <ButtonText>
                {isSubmitting ? t("Updating...") : t("Update Content")}
              </ButtonText>
            </Button>

            <Button 
              variant="delete"
              onPress={handleDelete}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              <ButtonText>{t("Delete Content")}</ButtonText>
            </Button>
  
              {errors.general && <ErrorText>{errors.general}</ErrorText>}
            </FormContainer>
          </Container>
        )}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
      />
    </KeyboardAvoidingView>
  );
}
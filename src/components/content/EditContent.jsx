import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import DropDownPicker from 'react-native-dropdown-picker';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

import { useContentStore } from '../../store/content';
import { useNotificationStore } from '../../store/notification';
import { countries } from '../shared/countries';

export default function EditContent({ route }) {
  const { contentId } = route.params;
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
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

  const styles = {
    container: {
      flex: 1,
      width: '90%',
      maxWidth: 800,
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: themes[theme].spacing.large,
      backgroundColor: themes[theme].colors.background,
    },
    formContainer: {
      marginBottom: themes[theme].spacing.large,
    },
    input: (hasError) => ({
      backgroundColor: themes[theme].colors.white,
      color: '#000000',
      padding: themes[theme].spacing.medium,
      marginBottom: themes[theme].spacing.small,
      borderRadius: themes[theme].borderRadius.medium,
      fontSize: themes[theme].typography.regular,
      borderWidth: 1,
      borderColor: hasError ? themes[theme].colors.error : themes[theme].colors.border,
    }),
    errorText: {
      color: themes[theme].colors.error,
      fontSize: themes[theme].typography.small,
      marginBottom: themes[theme].spacing.small,
    },
    button: (variant) => ({
      backgroundColor: variant === 'delete' ? themes[theme].colors.error : themes[theme].colors.primary,
      padding: themes[theme].spacing.medium,
      borderRadius: themes[theme].borderRadius.medium,
      alignItems: 'center',
      marginTop: themes[theme].spacing.medium,
      opacity: isSubmitting ? 0.5 : 1,
    }),
    buttonText: {
      color: themes[theme].colors.white,
      fontSize: themes[theme].typography.medium,
      fontWeight: 'bold',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themes[theme].colors.background,
    },
    dropDown: {
      backgroundColor: themes[theme].colors.white,
      borderColor: themes[theme].colors.border,
      marginBottom: themes[theme].spacing.small,
    },
  };

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themes[theme].colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: themes[theme].colors.background }}
    >
      <FlatList
        data={[{ key: 'form' }]}
        renderItem={() => (
          <View style={styles.container}>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input(!!errors.title)}
                placeholder={t("Title")}
                value={formData.title}
                onChangeText={(text) => handleChange('title', text)}
                maxLength={MAX_TITLE_LENGTH}
                placeholderTextColor="#666666"
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

              <TextInput
                style={styles.input(!!errors.description)}
                placeholder={t("Description")}
                value={formData.description}
                onChangeText={(text) => handleChange('description', text)}
                maxLength={MAX_DESCRIPTION_LENGTH}
                multiline
                numberOfLines={3}
                placeholderTextColor="#666666"
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

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
                style={styles.dropDown}
                dropDownContainerStyle={styles.dropDown}
                theme={theme === 'dark' ? 'DARK' : 'LIGHT'}
                zIndex={3000}
                listMode="SCROLLVIEW"
              />
              {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}

              <TextInput
                style={styles.input(!!errors.author)}
                placeholder={t("Author")}
                value={formData.author}
                onChangeText={(text) => handleChange('author', text)}
                placeholderTextColor="#666666"
              />
              {errors.author && <Text style={styles.errorText}>{errors.author}</Text>}

              <TextInput
                style={styles.input(false)}
                placeholder={t("Hint (optional)")}
                value={formData.hint}
                onChangeText={(text) => handleChange('hint', text)}
                placeholderTextColor="#666666"
              />

              <TextInput
                style={styles.input(false)}
                placeholder={t("Example sentence (optional)")}
                value={formData.exampleSentence}
                onChangeText={(text) => handleChange('exampleSentence', text)}
                multiline
                numberOfLines={2}
                placeholderTextColor="#666666"
              />

              <TouchableOpacity 
                style={styles.button()}
                onPress={handleSubmit}
                disabled={!isDirty || isSubmitting}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>
                  {isSubmitting ? t("Updating...") : t("Update Content")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.button('delete')}
                onPress={handleDelete}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>{t("Delete Content")}</Text>
              </TouchableOpacity>

              {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
            </View>
          </View>
        )}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
      />
    </KeyboardAvoidingView>
  );
}
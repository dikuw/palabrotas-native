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
    outerContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      padding: themes[theme].spacing.large,
      paddingTop: 0,
      position: 'relative',
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
      zIndex: 3000,
      position: 'relative',
    },
    input: (hasError) => ({
      backgroundColor: '#FFF',
      color: '#000000',
      padding: themes[theme].spacing.medium,
      marginBottom: themes[theme].spacing.small,
      borderRadius: 20,
      fontSize: themes[theme].typography.regular,
      borderWidth: 2,
      borderColor: hasError ? themes[theme].colors.error : themes[theme].colors.secondary,
      height: 55,
      textAlignVertical: 'center',
    }),
    buttonsContainer: {
      marginTop: themes[theme].spacing.large,
    },
    topButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: themes[theme].spacing.medium,
      marginBottom: themes[theme].spacing.medium,
    },
    actionButton: (isSubmit) => ({
      flex: 1,
      padding: themes[theme].spacing.small,
      paddingHorizontal: themes[theme].spacing.medium,
      borderRadius: 24,
      borderWidth: isSubmit ? 0 : 1,
      borderStyle: 'dashed',
      borderColor: '#000',
      alignItems: 'center',
      backgroundColor: isSubmit ? themes[theme].colors.primary : themes[theme].colors.white,
    }),
    buttonText: (isSubmit) => ({
      color: isSubmit ? themes[theme].colors.white : themes[theme].colors.text,
      fontSize: themes[theme].typography.regular,
      fontWeight: 'bold',
    }),
    backgroundCard: (index) => ({
      position: 'absolute',
      bottom: 18 + (index * 10),
      width: '99%',
      maxWidth: 800,
      height: 60,
      borderRadius: 9,
      borderWidth: 1,
      borderColor: '#000',
      backgroundColor: themes[theme].colors.primary,
      zIndex: 1,
      alignSelf: 'center',
    }),
    dropDown: {
      backgroundColor: '#FFF',
      borderColor: themes[theme].colors.secondary,
      borderWidth: 2,
      borderRadius: 20,
      marginBottom: themes[theme].spacing.small,
    },
    dropDownContainer: {
      backgroundColor: '#FFF',
      borderColor: themes[theme].colors.secondary,
      borderWidth: 2,
      borderRadius: 20,
    },
    deleteButton: {
      padding: themes[theme].spacing.small,
      paddingHorizontal: themes[theme].spacing.medium,
      borderRadius: 24,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: themes[theme].colors.error,
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    deleteButtonText: {
      color: themes[theme].colors.error,
      fontSize: themes[theme].typography.regular,
      fontWeight: 'bold',
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
      style={{ flex: 1, backgroundColor: 'transparent' }}
    >
      <View style={styles.outerContainer}>
        {/* Background cards */}
        {[0, 1, 2].map((index) => (
          <View key={index} style={styles.backgroundCard(index)} />
        ))}
        
        <FlatList
          style={{ zIndex: 3000 }}
          data={[{ key: 'form' }]}
          renderItem={() => (
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
                multiline={false}
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
                dropDownContainerStyle={styles.dropDownContainer}
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
                multiline={false}
                placeholderTextColor="#666666"
              />

              <TextInput
                style={styles.input(false)}
                placeholder={t("Example sentence (optional)")}
                value={formData.exampleSentence}
                onChangeText={(text) => handleChange('exampleSentence', text)}
                multiline={false}
                placeholderTextColor="#666666"
              />

              <View style={styles.buttonsContainer}>
                <View style={styles.topButtons}>
                  <TouchableOpacity 
                    style={styles.actionButton(true)}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.buttonText(true)}>
                      {isSubmitting ? t("Updating...") : t("Update")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.actionButton(false)}
                    onPress={() => navigation.navigate('Home')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.buttonText(false)}>
                      {t("Cancel")}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={handleDelete}
                  disabled={isSubmitting}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>
                    {t("Delete")}
                  </Text>
                </TouchableOpacity>
              </View>

              {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
            </View>
          )}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={false}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
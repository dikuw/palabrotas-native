import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

const CommentForm = ({ onSubmit }) => {
  const [comment, setComment] = useState('');
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);

  const handleSubmit = () => {
    onSubmit(comment);
    setComment('');
  };

  const styles = {
    formWrapper: {
      marginTop: 20,
      padding: 10,
    },
    textInput: {
      height: 100,
      borderWidth: 1,
      borderColor: themes[theme].colors.primary,
      borderRadius: 4,
      padding: 10,
      marginBottom: 10,
      textAlignVertical: 'top',
      color: themes[theme].colors.text,
      backgroundColor: themes[theme].colors.background,
    },
    submitButton: {
      alignSelf: 'flex-end',
      backgroundColor: themes[theme].colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 4,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    }
  };

  return (
    <View style={styles.formWrapper}>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder={t('Add a comment...')}
        placeholderTextColor={themes[theme].colors.textSecondary}
        multiline
        style={styles.textInput}
      />
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>{t('Submit')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CommentForm;
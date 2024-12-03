import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomText from '../CustomText'; // Assuming you have a custom text component for consistent styling

const CommentForm = ({ onSubmit }) => {
  const [comment, setComment] = useState('');
  const { t } = useTranslation();

  const handleSubmit = () => {
    onSubmit(comment);
    setComment('');
  };

  return (
    <View style={styles.formWrapper}>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder={t('Add a comment...')}
        placeholderTextColor="#666"
        multiline
        style={styles.textInput}
      />
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <CustomText style={styles.buttonText}>{t('Submit')}</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formWrapper: {
    marginTop: 20,
    padding: 10,
  },
  textInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#007AFF', // iOS primary color, adjust as needed
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    color: '#000', // Ensure text is visible
  },
  submitButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
});

export default CommentForm;
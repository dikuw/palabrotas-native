import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Platform, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from '../../store/auth';
import { useTagStore } from '../../store/tag';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

export default function AddTagToContent({ contentId, visible, onClose, onSave }) {
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const { getTags, tags, addTagToContent, getTagsForContent } = useTagStore();
  const { authStatus: { user } } = useAuthStore();
  const [selectedTags, setSelectedTags] = useState([]);
  const [existingTags, setExistingTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      await getTags();
      const contentTags = await getTagsForContent(contentId);
      setExistingTags(contentTags.map(tag => tag._id));
      setIsLoading(false);
    };
    fetchTags();
  }, [contentId]);

  useEffect(() => {
    // Filter out existing tags from the available options
    setAvailableTags(tags.filter(tag => !existingTags.includes(tag._id)));
  }, [tags, existingTags]);

  const handleTagClick = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSave = async () => {
    try {
      for (const tagId of selectedTags) {
        await addTagToContent(contentId, tagId, user._id);
      }
      if (onSave) {
        onSave(); // Trigger refresh in parent
      }
      onClose();
    } catch (error) {
      console.error('Error saving tags:', error);
    }
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    popupContent: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 20,
      width: '90%',
      maxHeight: '80%',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
    },
    scrollContainer: {
      maxHeight: '70%',
    },
    tagGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      gap: 10,
      padding: 5,
    },
    tagItem: {
      backgroundColor: themes[theme].colors.primary,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginVertical: 2,
      marginLeft: 20,
      marginRight: 2,
      minWidth: 100,
      alignItems: 'center',
      position: 'relative',
      height: 34,
      ...Platform.select({
        ios: {
          shadowColor: 'rgba(0,0,0,0.2)',
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 1,
          shadowRadius: 0,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    tagHole: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: themes[theme].colors.white,
      position: 'absolute',
      left: 6,
      top: '50%',
      ...Platform.select({
        ios: {
          shadowColor: '#CCC',
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 1,
          shadowRadius: 0,
        },
        android: {
          elevation: 1,
        },
      }),
    },
    tagText: {
      color: themes[theme].colors.white,
      fontSize: 16,
      fontFamily: Platform.select({
        ios: 'System',
        android: 'sans-serif',
      }),
    },
    tagTextSelected: {
      color: themes[theme].colors.white,
      fontWeight: '600',
    },
    tagItemSelected: {
      backgroundColor: themes[theme].colors.primaryDark,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 15,
    },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 4,
      minWidth: 80,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#6c757d',
    },
    saveButton: {
      backgroundColor: '#007bff',
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
    },
    spinnerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 200, // Ensure minimum height while loading
    },
    spinner: {
      width: 50,
      height: 50,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View 
          style={styles.popupContent}
          onStartShouldSetResponder={() => true}
          onTouchEnd={e => e.stopPropagation()}
        >
          <Text style={styles.title}>{t('Select Tags')}</Text>
          
          <ScrollView style={styles.scrollContainer}>
            {isLoading ? (
              <View style={styles.spinnerContainer}>
                <Image
                  source={require('../../assets/images/spinner.gif')}
                  style={styles.spinner}
                />
              </View>
            ) : (
              <View style={styles.tagGrid}>
                {availableTags.map(tag => (
                  <TouchableOpacity
                    key={tag._id}
                    style={[
                      styles.tagItem,
                      selectedTags.includes(tag._id) && styles.tagItemSelected
                    ]}
                    onPress={() => handleTagClick(tag._id)}
                  >
                    <Text style={[
                      styles.tagText,
                      selectedTags.includes(tag._id) && styles.tagTextSelected
                    ]}>
                      {tag.name}
                    </Text>
                    <View style={styles.tagHole} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>{t('Cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>{t('Save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
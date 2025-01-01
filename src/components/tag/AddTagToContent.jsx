import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from '../../store/auth';
import { useTagStore } from '../../store/tag';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

export default function AddTagToContent({ contentId, visible, onClose }) {
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const { getTags, tags, addTagToContent } = useTagStore();
  const { authStatus: { user } } = useAuthStore();
  const [selectedTags, setSelectedTags] = React.useState([]);

  useEffect(() => {
    getTags();
  }, []);

  const handleTagClick = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSave = async () => {
    for (const tagId of selectedTags) {
      await addTagToContent(contentId, tagId, user._id);
    }
    onClose();
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
      padding: 5,
      paddingHorizontal: 10,
      marginVertical: 2,
      marginHorizontal: 2,
      marginLeft: 20,
      position: 'relative',
      minWidth: 100,
      height: 34,
      justifyContent: 'center',
      alignItems: 'center',
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
            <View style={styles.tagGrid}>
              {tags.map(tag => (
                <TouchableOpacity
                  key={tag._id}
                  style={[
                    styles.tagItem,
                    selectedTags.includes(tag._id) && styles.tagItemSelected
                  ]}
                  onPress={() => handleTagClick(tag._id)}
                >
                  <Text style={styles.tagText}>{tag.name}</Text>
                  <View style={styles.tagHole} />
                </TouchableOpacity>
              ))}
            </View>
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
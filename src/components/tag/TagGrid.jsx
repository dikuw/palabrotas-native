import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image, FlatList } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';
import { useTagStore } from '../../store/tag';
import Spinner from '../shared/Spinner';

export default function TagGrid({ contentId, refreshTrigger }) {
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const { getTagsForContent, removeTagFromContent } = useTagStore();
  const [contentTags, setContentTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      marginVertical: 10,
    },
    gridContainer: {
      paddingHorizontal: 5,
    },
    row: {
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      gap: 8,
    },
    emptyText: {
      textAlign: 'center',
      color: themes[theme].colors.textSecondary,
      marginTop: 20,
    },
    tag: {
      backgroundColor: themes[theme].colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
      marginRight: 12,
      marginBottom: 8,
      overflow: 'visible',
      height: 34,
    },
    tagBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: themes[theme].colors.secondary,
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
    },
    tagCut: {
      position: 'absolute',
      right: -10,
      top: 0,
      bottom: 0,
      width: 20,
      backgroundColor: themes[theme].colors.secondary,
      transform: [{ skewX: '-15deg' }],
    },
    tagHole: {
      position: 'absolute',
      right: -4,
      top: '50%',
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: themes[theme].colors.background,
      marginTop: -4,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.25,
      shadowRadius: 1,
      elevation: 2,
    },
    tagText: {
      color: themes[theme].colors.white,
      fontSize: themes[theme].typography.small,
    },
    spinnerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 100,
    },
    spinner: {
      width: 50,
      height: 50,
    },
    deleteButton: {
      backgroundColor: themes[theme].colors.error,
      justifyContent: 'center',
      alignItems: 'center',
      width: 60,
      height: 34,
      marginBottom: 8,
      marginRight: 8,
      paddingHorizontal: 10,
    },
    deleteText: {
      color: themes[theme].colors.white,
      fontSize: 10,
      fontWeight: '500',
    },
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const data = await getTagsForContent(contentId);
        setContentTags(data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (contentId) {
      fetchTags();
    }
  }, [contentId, refreshTrigger]);

  const handleDelete = async (tagId) => {
    try {
      await removeTagFromContent(contentId, tagId);
      // Refresh tags after deletion
      const updatedTags = await getTagsForContent(contentId);
      setContentTags(updatedTags);
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };

  const renderRightActions = (tagId) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(tagId)}
      >
        <Text style={styles.deleteText}>{t('Remove')}</Text>
      </TouchableOpacity>
    );
  };

  // TODO: update Swipeable with Reanimated
  //  npm install react-native-reanimated
  //  npm install @react-native-community/gesture-handler
  //  npm install @react-native-community/swipeable
  //  Add this line to babel.config.js:
  //  module.exports = {  
  //  presets: ['module:metro-react-native-babel-preset'],
  //  plugins: ['react-native-reanimated/plugin'],
  //  };
  const TagComponent = ({ tag }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(tag._id)}
      rightThreshold={40}
    >
      <View style={styles.tag}>
        <View style={styles.tagBackground} />
        <View style={styles.tagCut} />
        <Text style={styles.tagText}>{tag.name}</Text>
        <View style={styles.tagHole} />
      </View>
    </Swipeable>
  );

  const renderTag = ({ item }) => (
    <TagComponent tag={item} />
  );

  if (isLoading) {
    return (
      <View style={styles.spinnerContainer}>
        <Spinner size={40} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={contentTags}
        renderItem={renderTag}
        keyExtractor={item => item._id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t('No tags yet!')}</Text>
        }
      />
    </GestureHandlerRootView>
  );
}
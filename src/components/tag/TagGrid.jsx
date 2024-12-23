import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';
import { useTagStore } from '../../store/tag';

export default function TagGrid({ contentId }) {
  const theme = useThemeStore(state => state.theme);
  const { getTagsForContent } = useTagStore();
  const [contentTags, setContentTags] = useState([]);

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
    },
    tagBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: themes[theme].colors.primary,
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
    },
    tagCut: {
      position: 'absolute',
      right: -10,
      top: 0,
      bottom: 0,
      width: 20,
      backgroundColor: themes[theme].colors.primary,
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
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getTagsForContent(contentId);
        setContentTags(data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    
    if (contentId) {
      fetchTags();
    }
  }, [contentId, getTagsForContent]);

  const TagComponent = ({ tag }) => (
    <View style={styles.tag}>
      <View style={styles.tagBackground} />
      <View style={styles.tagCut} />
      <Text style={styles.tagText}>{tag.name}</Text>
      <View style={styles.tagHole} />
    </View>
  );

  const renderTag = ({ item }) => (
    <TagComponent tag={item} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contentTags}
        renderItem={renderTag}
        keyExtractor={item => item._id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tags available</Text>
        }
      />
    </View>
  );
}
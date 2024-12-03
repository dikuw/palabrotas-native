import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTagStore } from '../../store/tag';

export default function TagGrid({ contentId }) {
  const { getTagsForContent, tags } = useTagStore();

  useEffect(() => {
    getTagsForContent(contentId);
  }, [contentId]);

  const renderTag = ({ item }) => (
    <View style={styles.tagItem}>
      <Text style={styles.tagText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tags}
        renderItem={renderTag}
        keyExtractor={item => item._id}
        numColumns={3} // Adjust based on screen size
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  gridContainer: {
    paddingHorizontal: 5,
  },
  row: {
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  tagItem: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    // Shadow for Android
    elevation: 2,
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});
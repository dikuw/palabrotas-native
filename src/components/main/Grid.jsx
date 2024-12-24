import React from 'react';
import { FlatList, ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';
import { useContentStore } from '../../store/content';
import Card from './Card';
import NoResults from './NoResults';

export default function Grid() {
  const theme = useThemeStore(state => state.theme);
  const { contents, isSearching, searchResults, isLoading } = useContentStore();
  const displayContents = searchResults.length > 0 ? searchResults : contents;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themes[theme].colors.background,
    },
    flatListContent: {
      padding: 8,
      minHeight: '100%',
    },
    itemContainer: {
      width: '100%',
      marginVertical: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: themes[theme].spacing.large,
    },
    loadingText: {
      marginTop: themes[theme].spacing.small,
      color: themes[theme].colors.text,
      fontSize: themes[theme].typography.regular,
    }
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themes[theme].colors.primary} />
        <Text style={styles.loadingText}>Loading content...</Text>
      </View>
    );
  }

  if (isSearching && searchResults.length === 0) {
    return <NoResults />;
  }

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Card 
          item={item}
          showEditIcon={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={displayContents}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>No content available</Text>
          </View>
        )}
      />
    </View>
  );
}
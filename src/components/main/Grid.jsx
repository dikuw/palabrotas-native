import React from 'react';
import { FlatList, Dimensions, ActivityIndicator, StyleSheet, View } from 'react-native';
import styled from 'styled-components/native';
import { useContentStore } from '../../store/content';
import Card from './Card';
import NoResults from './NoResults';

const GridContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const styles = StyleSheet.create({
  flatListContent: {
    padding: 8,
    minHeight: '100%', 
  },
  itemContainer: {
    width: '100%',
    marginVertical: 8,
  }
});

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

const LoadingText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.small}px;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.regular}px;
`;

export default function Grid() {
  const { contents, isSearching, searchResults, isLoading } = useContentStore();
  const displayContents = searchResults.length > 0 ? searchResults : contents;

  if (isLoading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <LoadingText>Loading content...</LoadingText>
      </LoadingContainer>
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
    <GridContainer>
      <FlatList
        data={displayContents}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <LoadingContainer>
            <LoadingText>No content available</LoadingText>
          </LoadingContainer>
        )}
      />
    </GridContainer>
  );
}
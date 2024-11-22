import React from 'react';
import { FlatList, Dimensions, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useContentStore } from '../../store/content';
import ContentCard from './ContentCard';
import NoResults from './NoResults';

const GridContainer = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.medium}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

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
  const numColumns = Math.floor(Dimensions.get('window').width / 300); // Adjust card width as needed

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

  const renderItem = ({ item }) => (
    <ContentCard 
      content={item}
      showEditIcon={false}
    />
  );

  return (
    <GridContainer>
      <FlatList
        data={displayContents}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between' } : null}
        contentContainerStyle={{ padding: 8 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={5}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
      />
    </GridContainer>
  );
}
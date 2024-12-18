import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useTagStore } from '../../store/tag';

const Tag = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  padding-horizontal: 12px;
  padding-vertical: 6px;
  flex-direction: row;
  align-items: center;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  margin-right: 12px;
  margin-bottom: 8px;
  overflow: visible;
`;

const TagBackground = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`;

const TagCut = styled.View`
  position: absolute;
  right: -10px;
  top: 0;
  bottom: 0;
  width: 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  transform: skewX(-15deg);
`;

const TagHole = styled.View`
  position: absolute;
  right: -4px;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
  margin-top: -4px;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.25;
  shadow-radius: 1px;
  elevation: 2;
`;

const TagText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.small}px;
`;

const TagComponent = ({ tag }) => (
  <Tag>
    <TagBackground />
    <TagCut />
    <TagText>{tag.name}</TagText>
    <TagHole />
  </Tag>
);

export default function TagGrid({ contentId }) {
  const { getTagsForContent } = useTagStore();
  const [contentTags, setContentTags] = useState([]);

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
    color: '#666',
    marginTop: 20,
  },
});
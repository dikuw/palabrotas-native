import React from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import Card from '../main/Card';

const ContentGrid = ({ contents, showEditIcon }) => {
  const renderItem = ({ item }) => (
    <Card item={item} showEditIcon={showEditIcon} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contents}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
});

export default ContentGrid;
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Card from '../main/Card';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

const GridBackground = ({ theme }) => {
  const lines = [];
  const size = 50;
  const width = 2000;
  const height = 2000;

  // Create vertical lines
  for (let i = 0; i <= width; i += size) {
    lines.push(
      <View
        key={`v${i}`}
        style={[
          styles.verticalLine,
          {
            left: i,
            backgroundColor: themes[theme].colors.primary,
            opacity: 0.2,
          },
        ]}
      />
    );
  }

  // Create horizontal lines
  for (let i = 0; i <= height; i += size) {
    lines.push(
      <View
        key={`h${i}`}
        style={[
          styles.horizontalLine,
          {
            top: i,
            backgroundColor: themes[theme].colors.primary,
            opacity: 0.2,
          },
        ]}
      />
    );
  }

  return <View style={styles.gridPattern}>{lines}</View>;
};

const ContentGrid = ({ contents, showEditIcon }) => {
  const theme = useThemeStore(state => state.theme);
  const renderItem = ({ item }) => (
    <Card item={item} showEditIcon={showEditIcon} />
  );

  return (
    <View style={styles.container}>
      <GridBackground theme={theme} />
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
    backgroundColor: 'transparent',
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: 'transparent',
  },
  gridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  verticalLine: {
    position: 'absolute',
    width: 1,
    top: 0,
    bottom: 0,
  },
  horizontalLine: {
    position: 'absolute',
    height: 1,
    left: 0,
    right: 0,
  },
});

export default ContentGrid;
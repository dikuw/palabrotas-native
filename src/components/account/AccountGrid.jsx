import React from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

const GridContainer = styled.View`
  flex: 1;
  padding: 10px;
`;

const ContentCard = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.card};
  border-radius: 8px;
  padding: 15px;
  margin: 5px;
  elevation: 2;
`;

const ContentTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 5px;
`;

const ContentDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

export default function AccountGrid({ contents }) {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    
    <ContentCard 
      onPress={() => navigation.navigate('Content', { contentId: item._id })}
    >
      <ContentTitle>{item.title}</ContentTitle>
      <ContentDescription>{item.description}</ContentDescription>
    </ContentCard>
  );

  return (
    <GridContainer>
      <FlatList
        data={contents}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={1} // Change to 2 for grid layout
        contentContainerStyle={{ padding: 5 }}
      />
    </GridContainer>
  );
}
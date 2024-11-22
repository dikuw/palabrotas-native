import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  margin: ${({ theme }) => theme.spacing.small}px;
  padding: ${({ theme }) => theme.spacing.medium}px;
  width: ${({ width }) => width}px;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.1;
      shadow-radius: 3px;
    `,
    android: `
      elevation: 3;
    `
  })}
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.medium}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
`;

const Description = styled.Text`
  font-size: ${({ theme }) => theme.typography.regular}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
`;

const TagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.small}px;
`;

const Tag = styled.View`
  background-color: ${({ theme }) => theme.colors.primary}20;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.small}px;
`;

const TagText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.small}px;
`;

const EditButton = styled.TouchableOpacity`
  position: absolute;
  top: ${({ theme }) => theme.spacing.small}px;
  right: ${({ theme }) => theme.spacing.small}px;
  padding: ${({ theme }) => theme.spacing.small}px;
`;

export default function ContentCard({ content, showEditIcon = false }) {
  const navigation = useNavigation();
  const cardWidth = (Dimensions.get('window').width / Math.floor(Dimensions.get('window').width / 300)) - 32;

  const handlePress = () => {
    navigation.navigate('Content', { contentId: content._id });
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigation.navigate('EditContent', { contentId: content._id });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card width={cardWidth}>
        <Title numberOfLines={2}>{content.title}</Title>
        <Description numberOfLines={3}>{content.description}</Description>
        
        <TagsContainer>
          {content.tags?.map(tag => (
            <Tag key={tag._id}>
              <TagText>{tag.name}</TagText>
            </Tag>
          ))}
        </TagsContainer>

        {showEditIcon && (
          <EditButton onPress={handleEdit}>
            <Icon name="edit" size={24} color={theme.colors.primary} />
          </EditButton>
        )}
      </Card>
    </TouchableOpacity>
  );
}
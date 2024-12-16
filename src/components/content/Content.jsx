import React, { useState, useEffect } from 'react';
import { ScrollView, Platform, ActivityIndicator, FlatList } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from "react-native-country-flag";

import { useAuthStore } from '../../store/auth';
import { useContentStore } from '../../store/content';
import { useCommentStore } from '../../store/comment';
import { useNotificationStore } from '../../store/notification';

import CommentForm from '../comment/CommentForm';
import TagGrid from '../tag/TagGrid';
import AddTagToContent from '../tag/AddTagToContent';

const ContentWrapper = styled.View`
  flex: 1;
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ContentHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.xlarge}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.medium}px;
`;

const Description = styled.Text`
  font-size: ${({ theme }) => theme.typography.medium}px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

const ExampleSentence = styled.Text`
  font-style: italic;
  font-size: ${({ theme }) => theme.typography.medium}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

const AuthorInfo = styled.Text`
  font-size: ${({ theme }) => theme.typography.small}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TagContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin: ${({ theme }) => theme.spacing.medium}px 0;
`;

const AddTagButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.background};
  border-width: 1px;
  border-style: dashed;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.small}px;
`;

const AddTagText = styled.Text`
  font-size: ${({ theme }) => theme.typography.small}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CommentSection = styled.View`
  margin-top: ${({ theme }) => theme.spacing.large}px;
`;

const ToggleButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.small}px;
`;

const ToggleText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.regular}px;
  margin-left: ${({ theme }) => theme.spacing.small}px;
`;

const ToggleIcon = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.large}px;
`;

const CommentList = styled.View`
  margin-top: ${({ theme }) => theme.spacing.large}px;
`;

const CommentItem = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.medium}px 0;
`;

const CommentText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
`;

const CommentMeta = styled.Text`
  font-size: ${({ theme }) => theme.typography.small}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

const LoadingText = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.regular}px;
  margin-top: ${({ theme }) => theme.spacing.medium}px;
`;

export default function Content({ route }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { contentId } = route.params;
  const { authStatus } = useAuthStore();
  const { getContentById } = useContentStore();
  const { comments, getCommentsByContentId, addComment } = useCommentStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  
  const [content, setContent] = useState(null);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchContentAndComments = async () => {
      console.log("fetchContentAndComments", contentId);
      try {
        const contentData = await getContentById(contentId);
        setContent(contentData);
        await getCommentsByContentId(contentId);
      } catch (error) {
        console.error('Error fetching content or comments:', error);
        addNotification(t('Failed to load content or comments'), 'error');
      }
    };

    fetchContentAndComments();
  }, [contentId, addNotification, t]);

  const handleAddComment = async (commentText) => {
    try {
      await addComment(contentId, authStatus.user._id, commentText);
      addNotification(t('Comment added successfully'), 'success');
    } catch (error) {
      console.error('Error adding comment:', error);
      addNotification(t('Failed to add comment'), 'error');
    }
  };

  if (!content) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <LoadingText>{t('Loading...')}</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <ContentWrapper>
      <ContentHeader>
        <Title>{content.title}</Title>
        {content.country && (
          <ReactCountryFlag
            isoCode={content.country}
            size={24}
          />
        )}
      </ContentHeader>
      
      <Description>{content.description}</Description>
      
      {content.exampleSentence && (
        <ExampleSentence>{content.exampleSentence}</ExampleSentence>
      )}
      
      <AuthorInfo>{t('Created by')}: {content.author}</AuthorInfo>
      
      <TagContainer>
        <TagGrid contentId={content._id} />
        <AddTagButton onPress={() => setShowTagSelector(true)}>
          <AddTagText>{t('+ Add Tag')}</AddTagText>
        </AddTagButton>
      </TagContainer>

      {showTagSelector && (
        <AddTagToContent 
          contentId={content._id} 
          onClose={() => setShowTagSelector(false)} 
        />
      )}

      <CommentSection>
        <ToggleButton onPress={() => setShowComments(!showComments)}>
          <ToggleIcon>
            {showComments ? '▼' : '▶'}
          </ToggleIcon>
          <ToggleText>
            {t('Show Comments')} ({comments.length})
          </ToggleText>
        </ToggleButton>

        {showComments && (
          <>
            <CommentList>
              <FlatList
                data={comments}
                renderItem={({ item }) => (
                  <CommentItem>
                    <CommentText>{item.text}</CommentText>
                    <CommentMeta>
                      {t('Created by')}: {item.owner.name} | {new Date(item.createdAt).toLocaleString()}
                    </CommentMeta>
                  </CommentItem>
                )}
                keyExtractor={item => item._id}
              />
            </CommentList>
            
            {authStatus.isLoggedIn && (
              <CommentForm onSubmit={handleAddComment} />
            )}
          </>
        )}
      </CommentSection>
    </ContentWrapper>
  );
}
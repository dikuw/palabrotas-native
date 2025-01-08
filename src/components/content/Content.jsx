import React, { useState, useEffect } from 'react';
import { Platform, ActivityIndicator, FlatList, View, Text, TouchableOpacity, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from "react-native-country-flag";
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

import { useAuthStore } from '../../store/auth';
import { useContentStore } from '../../store/content';
import { useCommentStore } from '../../store/comment';
import { useNotificationStore } from '../../store/notification';

import CommentForm from '../comment/CommentForm';
import TagGrid from '../tag/TagGrid';
import AddTagToContent from '../tag/AddTagToContent';

export default function Content({ route }) {
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const { contentId } = route.params;
  const { authStatus } = useAuthStore();
  const { getContentById } = useContentStore();
  const { comments, getCommentsByContentId, addComment } = useCommentStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  
  const [content, setContent] = useState(null);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleTagsSaved = () => {
    setRefreshTrigger(prev => prev + 1); // Increment to trigger refresh
  };

  const styles = {
    wrapper: {
      flex: 1,
      width: '90%',
      maxWidth: 800,
      margin: 0,
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: themes[theme].spacing.large,
      backgroundColor: themes[theme].colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: themes[theme].spacing.large,
    },
    title: {
      fontSize: themes[theme].typography.xlarge,
      fontWeight: 'bold',
      color: themes[theme].colors.primary,
      flex: 1,
      marginRight: themes[theme].spacing.medium,
    },
    description: {
      fontSize: themes[theme].typography.medium,
      color: themes[theme].colors.text,
      marginBottom: themes[theme].spacing.large,
    },
    exampleSentence: {
      fontStyle: 'italic',
      fontSize: themes[theme].typography.medium,
      color: themes[theme].colors.textSecondary,
      marginBottom: themes[theme].spacing.large,
    },
    authorInfo: {
      fontSize: themes[theme].typography.small,
      color: themes[theme].colors.textSecondary,
    },
    tagContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      margin: `${themes[theme].spacing.medium}px 0`,
    },
    addTagButton: {
      backgroundColor: themes[theme].colors.background,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: themes[theme].colors.border,
      padding: '4px 8px',
      borderRadius: themes[theme].borderRadius.small,
    },
    addTagText: {
      fontSize: themes[theme].typography.small,
      color: themes[theme].colors.textSecondary,
    },
    commentSection: {
      marginTop: themes[theme].spacing.large,
    },
    toggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: themes[theme].spacing.small,
    },
    toggleText: {
      color: themes[theme].colors.primary,
      fontSize: themes[theme].typography.regular,
      marginLeft: themes[theme].spacing.small,
    },
    toggleIcon: {
      color: themes[theme].colors.primary,
      fontSize: themes[theme].typography.large,
    },
    commentList: {
      marginTop: themes[theme].spacing.large,
    },
    commentItem: {
      borderBottomWidth: 1,
      borderBottomColor: themes[theme].colors.border,
      padding: `${themes[theme].spacing.medium}px 0`,
    },
    commentText: {
      color: themes[theme].colors.text,
      marginBottom: themes[theme].spacing.small,
    },
    commentMeta: {
      fontSize: themes[theme].typography.small,
      color: themes[theme].colors.textSecondary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: themes[theme].spacing.large,
    },
    loadingText: {
      color: themes[theme].colors.textSecondary,
      fontSize: themes[theme].typography.regular,
      marginTop: themes[theme].spacing.medium,
    },
    commentFormContainer: {
      marginBottom: Platform.OS === 'android' ? 120 : 80, // Extra padding for Android
      paddingHorizontal: 16,
    },
    keyboardSpacer: {
      height: Platform.OS === 'android' ? 200 : 100, // Extra space at the bottom
    },
  };

  useEffect(() => {
    const fetchContentAndComments = async () => {
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

  const renderContent = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{content.title}</Text>
        {content.country && (
          <ReactCountryFlag
            isoCode={content.country}
            size={24}
          />
        )}
      </View>
      
      <Text style={styles.description}>{content.description}</Text>
      
      {content.exampleSentence && (
        <Text style={styles.exampleSentence}>{content.exampleSentence}</Text>
      )}
      
      <Text style={styles.authorInfo}>{t('Created by')}: {content.author}</Text>
      
      <View style={styles.tagContainer}>
        <TagGrid 
          contentId={content._id} 
          refreshTrigger={refreshTrigger} 
        />
        <TouchableOpacity 
          style={styles.addTagButton}
          onPress={() => setShowTagSelector(true)}
        >
          <Text style={styles.addTagText}>{t('+ Add Tag')}</Text>
        </TouchableOpacity>
      </View>

      {showTagSelector && (
        <AddTagToContent 
          contentId={content._id} 
          onClose={() => setShowTagSelector(false)} 
          onSave={handleTagsSaved}
        />
      )}

      <View style={styles.commentSection}>
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setShowComments(!showComments)}
        >
          <Text style={styles.toggleIcon}>
            {showComments ? '▼' : '▶'}
          </Text>
          <Text style={styles.toggleText}>
            {t('Show Comments')} ({comments.length})
          </Text>
        </TouchableOpacity>

        {showComments && (
          <>
            <View style={styles.commentList}>
              <FlatList
                data={comments}
                renderItem={({ item }) => (
                  <View style={styles.commentItem}>
                    <Text style={styles.commentText}>{item.text}</Text>
                    <Text style={styles.commentMeta}>
                      {t('Created by')}: {item.owner.name} | {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </View>
                )}
                keyExtractor={item => item._id}
                nestedScrollEnabled
              />
            </View>
            
            {authStatus.isLoggedIn && (
              <View style={styles.commentFormContainer}>
                <CommentForm onSubmit={handleAddComment} />
              </View>
            )}
          </>
        )}
      </View>
      <View style={styles.keyboardSpacer} />
    </>
  );

  if (!content) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themes[theme].colors.primary} />
        <Text style={styles.loadingText}>{t('Loading...')}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "android" ? 100 : 64}
    >
      <FlatList
        style={styles.wrapper}
        contentContainerStyle={{ flexGrow: 1 }}
        data={[{ key: 'content' }]}
        renderItem={() => renderContent()}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={<View style={{ height: 200 }} />}
        onScrollBeginDrag={Keyboard.dismiss}
      />
    </KeyboardAvoidingView>
  );
}
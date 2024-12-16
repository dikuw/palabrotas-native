import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from "react-i18next";

import { useAuthStore } from '../../store/auth';
import { useContentStore } from '../../store/content'; 
import { useFlashcardStore } from '../../store/flashcard';
import { useVoteStore } from '../../store/vote';
import { useNotificationStore } from '../../store/notification';

export default function Card({ item, showEditIcon }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { addFlashcard } = useFlashcardStore(); 
  const { authStatus } = useAuthStore(); 
  const { addVote } = useVoteStore(); 
  const { getContentsSortedByVoteDesc } = useContentStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const handlePress = () => {
    navigation.navigate('Content', { id: item._id });
  };

  const handleEdit = () => {
    navigation.navigate('EditContent', { id: item._id });
  };

  const handleAddToFlashcard = async () => {
    try {
      const result = await addFlashcard({ userId: authStatus.user._id, contentId: item._id });
      if (result.success) {
        addNotification(t('Added to flashcards successfully!'), 'success');
      } else {
        addNotification(result.message, 'info');
      }
    } catch (error) {
      console.error('Error adding to flashcards:', error);
      addNotification(t('Failed to add to flashcards. Please try again.'), 'error');
    }
  };

  const handleVote = async (voteType) => {
    if (!authStatus.isLoggedIn || !authStatus.user?._id) {
      addNotification(t('Please log in to vote'), 'info');
      return;
    }

    try {
      const result = await addVote(item._id, authStatus.user._id, voteType);
      if (result.success) {
        addNotification(t('Vote recorded successfully!'), 'success');
        await getContentsSortedByVoteDesc();
      } else {
        addNotification(result.message, 'info');
      }
    } catch (error) {
      console.error('Error voting:', error);
      addNotification(t('Failed to record vote. Please try again.'), 'error');
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {item.country && (
        <View style={styles.flagContainer}>
          <Text>{item.country}</Text>
        </View>
      )}
      
      {showEditIcon && (
        <TouchableOpacity 
          style={styles.editIcon} 
          onPress={handleEdit}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="edit" size={20} color="#007AFF" />
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      <Text style={styles.authorText}>
        {t('created by')}: {item.author}
      </Text>

      {authStatus.isLoggedIn && (
        <TouchableOpacity 
          style={styles.addIcon}
          onPress={handleAddToFlashcard}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="plus" size={20} color="#007AFF" />
        </TouchableOpacity>
      )}

      <View style={styles.voteContainer}>
        <TouchableOpacity 
          onPress={() => handleVote('upvote')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-up" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleVote('downvote')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-down" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  flagContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  editIcon: {
    position: 'absolute',
    top: 70,
    right: 10,
  },
  content: {
    flex: 1,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
  },
  authorText: {
    position: 'absolute',
    bottom: 10,
    right: 40,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  addIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  voteContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    alignItems: 'center',
  },
});
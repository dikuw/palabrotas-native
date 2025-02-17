import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ReactCountryFlag from "react-native-country-flag";
import { useTranslation } from "react-i18next";
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

import { useAuthStore } from '../../store/auth';
import { useContentStore } from '../../store/content'; 
import { useFlashcardStore } from '../../store/flashcard';
import { useVoteStore } from '../../store/vote';
import { useNotificationStore } from '../../store/notification';

export default function Card({ item, showEditIcon }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const { addFlashcard } = useFlashcardStore(); 
  const { authStatus } = useAuthStore(); 
  const { addVote } = useVoteStore(); 
  const { getContentsSortedByVoteDesc } = useContentStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const handlePress = () => {
    navigation.navigate('Content', { contentId: item._id });
  };

  const handleEdit = () => {
    navigation.navigate('EditContent', { contentId: item._id });
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
        addNotification(t(result.message), 'info');
      }
    } catch (error) {
      console.error('Error voting:', error);
      addNotification(t('Failed to record vote. Please try again.'), 'error');
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.backgroundCard} />
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        {item.country && (
          <View style={styles.flagContainer}>
            <ReactCountryFlag
              isoCode={item.country}
              size={16}
            />
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
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '90%',
    marginBottom: 10,
    position: 'relative',
    alignSelf: 'center',
    marginHorizontal: 'auto',
  },
  backgroundCard: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    backgroundColor: '#F9BC60',
    top: 7,
    left: 7,
    zIndex: 1,
  },
  card: {
    width: '100%',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
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
    minHeight: 150,
    zIndex: 2,
  },
  flagContainer: { 
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  editIcon: {
    position: 'absolute',
    top: 70,
    right: 10,
  },
  content: {
    flex: 1,
    marginVertical: 10,
    marginTop: 10,
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
    flexDirection: 'row',
    gap: 18,
    alignItems: 'center',
  },
});
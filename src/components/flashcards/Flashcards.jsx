import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

import { useAuthStore } from '../../store/auth';
import { useFlashcardStore } from '../../store/flashcard';
import { NoPermissionView } from '../shared/index';
import Flashcard from './Flashcard';
import Spinner from '../shared/Spinner';

export default function Flashcards() {
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const { authStatus } = useAuthStore();
  const { 
    flashcards, 
    dueFlashcards, 
    getFlashcards, 
    getDueFlashcards, 
    updateFlashcardReview
  } = useFlashcardStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [initialFetch, setInitialFetch] = useState(true);

  const styles = {
    container: {
      flex: 1,
      width: '90%',
      maxWidth: 1000,
      marginVertical: 30,
      marginHorizontal: 'auto',
      padding: 4,
      backgroundColor: 'transparent',
    },
    header: {
      padding: themes[theme].spacing.large,
      backgroundColor: themes[theme].colors.primary,
      borderRadius: themes[theme].borderRadius.medium,
      marginBottom: themes[theme].spacing.large,
    },
    headerText: {
      color: themes[theme].colors.white,
      fontSize: themes[theme].typography.large,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    counter: {
      textAlign: 'center',
      marginTop: themes[theme].spacing.medium,
      fontSize: themes[theme].typography.small,
      color: themes[theme].colors.textSecondary,
    },
    message: {
      textAlign: 'center',
      marginTop: themes[theme].spacing.medium,
      fontSize: themes[theme].typography.regular,
      color: themes[theme].colors.text,
    },
    spinnerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
  };

  useEffect(() => {
    const fetchCards = async () => {
      if (authStatus.isLoggedIn && authStatus.user) {
        await Promise.all([
          getFlashcards(authStatus.user._id),
          getDueFlashcards(authStatus.user._id)
        ]);
        setInitialFetch(false);
      }
    };
    fetchCards();
  }, [authStatus.isLoggedIn, authStatus.user, getFlashcards, getDueFlashcards]);

  const handleReviewAndNext = async (flashcardId, quality, keepInQueue) => {
    try {
      if (!keepInQueue) {
        const updatedDueFlashcards = dueFlashcards.filter(card => card._id !== flashcardId);
        useFlashcardStore.setState({ dueFlashcards: updatedDueFlashcards });
        setCurrentIndex(prevIndex => prevIndex % updatedDueFlashcards.length);
      } else {
        // Move the current card to the end of the deck
        const currentCard = dueFlashcards[currentIndex];
        const remainingCards = dueFlashcards.filter((_, index) => index !== currentIndex);
        const reorderedCards = [...remainingCards, currentCard];
        useFlashcardStore.setState({ dueFlashcards: reorderedCards });
        setCurrentIndex(0);
      }

      await updateFlashcardReview(flashcardId, quality, keepInQueue);
    } catch (error) {
      console.error('Error updating flashcard review:', error);
      await getFlashcards(authStatus.user._id);
      await getDueFlashcards(authStatus.user._id);
    }
  };

  if (!authStatus.isLoggedIn || !authStatus.user) {
    return <NoPermissionView message={t("Please log in to view this page")} />;
  }

  if (initialFetch) {
    return (
      <View style={styles.spinnerContainer}>
        <Spinner size={40} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {flashcards.length > 0 ? (
        dueFlashcards.length > 0 ? (
          <View>
            <Flashcard 
              item={dueFlashcards[currentIndex]} 
              onNext={handleReviewAndNext}
              totalCards={dueFlashcards.length}
            />
          </View>
        ) : (
          <Text style={styles.message}>
            {t("You've completed all your flashcards for today. Please come back tomorrow.")}
          </Text>
        )
      ) : (
        <Text style={styles.message}>{t("You don't have any flashcards yet.")}</Text>
      )}
    </View>
  );
}
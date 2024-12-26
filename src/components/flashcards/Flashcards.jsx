import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

import { useAuthStore } from '../../store/auth';
import { useFlashcardStore } from '../../store/flashcard';
import { NoPermissionView } from '../shared/index';
import Flashcard from './Flashcard';

export default function Flashcards() {
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const { authStatus } = useAuthStore();
  const { 
    flashcards, 
    dueFlashcards, 
    getFlashcards, 
    getDueFlashcards, 
    updateFlashcardReview,
    isLoading 
  } = useFlashcardStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const styles = {
    container: {
      flex: 1,
      width: '90%',
      maxWidth: 1000,
      marginVertical: 30,
      marginHorizontal: 'auto',
      padding: 4,
      backgroundColor: themes[theme].colors.background,
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themes[theme].colors.background,
    },
  };

  useEffect(() => {
    if (authStatus.isLoggedIn && authStatus.user) {
      getFlashcards(authStatus.user._id);
      getDueFlashcards(authStatus.user._id);
    }
  }, [authStatus.isLoggedIn, authStatus.user, getFlashcards, getDueFlashcards]);

  const handleReviewAndNext = async (flashcardId, quality, keepInQueue) => {
    try {
      await updateFlashcardReview(flashcardId, quality, keepInQueue);
      
      if (!keepInQueue) {
        const updatedDueFlashcards = dueFlashcards.filter(card => card._id !== flashcardId);
        useFlashcardStore.setState({ dueFlashcards: updatedDueFlashcards });
        setCurrentIndex(prevIndex => prevIndex % updatedDueFlashcards.length);
      } else {
        const currentCard = dueFlashcards.find(card => card._id === flashcardId);
        const remainingCards = dueFlashcards.filter(card => card._id !== flashcardId);
        const updatedDueFlashcards = [...remainingCards, currentCard];
        useFlashcardStore.setState({ dueFlashcards: updatedDueFlashcards });
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Error updating flashcard review:', error);
    }
  };

  if (!authStatus.isLoggedIn || !authStatus.user) {
    return <NoPermissionView message={t("Please log in to view this page")} />;
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themes[theme].colors.primary} />
        <Text style={styles.message}>{t("Loading flashcards...")}</Text>
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
            <Text style={styles.counter}>
              {currentIndex + 1} {t('of')} {dueFlashcards.length}
            </Text>
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
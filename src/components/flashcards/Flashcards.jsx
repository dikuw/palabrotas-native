import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from '../../store/auth';
import { useFlashcardStore } from '../../store/flashcard';
import { NoPermissionView } from '../shared/index';
import Flashcard from './Flashcard';

const Container = styled.View`
  flex: 1;
  width: 90%;
  max-width: 1000px;
  margin: 30px auto;
  padding: 4px;
`;

const Header = styled.View`
  padding: ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

const HeaderText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.large}px;
  font-weight: bold;
  text-align: center;
`;

const FlashcardCounter = styled.Text`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.medium}px;
  font-size: ${({ theme }) => theme.typography.small}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Message = styled.Text`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.medium}px;
  font-size: ${({ theme }) => theme.typography.regular}px;
  color: ${({ theme }) => theme.colors.text};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function Flashcards() {
  const { t } = useTranslation();
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
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Message>{t("Loading flashcards...")}</Message>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderText>{t("Your Flashcards")}</HeaderText>
      </Header>

      {flashcards.length > 0 ? (
        dueFlashcards.length > 0 ? (
          <View>
            <Flashcard 
              item={dueFlashcards[currentIndex]} 
              onNext={handleReviewAndNext}
            />
            <FlashcardCounter>
              {currentIndex + 1} {t('of')} {dueFlashcards.length}
            </FlashcardCounter>
          </View>
        ) : (
          <Message>
            {t("You've completed all your flashcards for today. Please come back tomorrow.")}
          </Message>
        )
      ) : (
        <Message>{t("You don't have any flashcards yet.")}</Message>
      )}
    </Container>
  );
}
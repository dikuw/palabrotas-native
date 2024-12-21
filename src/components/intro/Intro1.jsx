import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.xlarge}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

const Description = styled.Text`
  font-size: ${({ theme }) => theme.typography.medium}px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xlarge}px;
  line-height: 24px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.large}px;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${({ variant, theme }) => 
    variant === 'secondary' ? 'transparent' : theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.medium}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  align-items: center;
  border-width: ${({ variant }) => (variant === 'secondary' ? 1 : 0)}px;
  border-color: ${({ theme }) => theme.colors.primary};
`;

const ButtonText = styled.Text`
  color: ${({ variant, theme }) => 
    variant === 'secondary' ? theme.colors.primary : theme.colors.white};
  font-size: ${({ theme }) => theme.typography.medium}px;
  font-weight: bold;
`;

const ProgressDots = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.large}px;
  gap: ${({ theme }) => theme.spacing.small}px;
`;

const Dot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.border};
`;

const introPages = [
  {
    title: "Welcome to Palabrotas",
    description: "Learn and share interesting expressions and slang from different cultures and languages around the world."
  },
  {
    title: "Discover New Words",
    description: "Browse through a collection of unique expressions, save your favorites, and learn their meanings and usage."
  },
  {
    title: "Join the Community",
    description: "Share your knowledge, add new expressions, and interact with language enthusiasts from across the globe."
  }
];

export default function Intro1() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);

  const handleGetStarted = () => {
    if (currentPage < introPages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigation.navigate('Register');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <Container>
      <ContentContainer>
        <Title>{t(introPages[currentPage].title)}</Title>
        <Description>
          {t(introPages[currentPage].description)}
        </Description>

        <ProgressDots>
          {introPages.map((_, index) => (
            <Dot key={index} active={index === currentPage} />
          ))}
        </ProgressDots>
      </ContentContainer>

      <ButtonContainer>
        <Button onPress={handleGetStarted}>
          <ButtonText>
            {currentPage < introPages.length - 1 
              ? t("Next")
              : t("Get Started")}
          </ButtonText>
        </Button>

        <Button variant="secondary" onPress={handleLogin}>
          <ButtonText variant="secondary">
            {t("I already have an account")}
          </ButtonText>
        </Button>
      </ButtonContainer>
    </Container>
  );
}
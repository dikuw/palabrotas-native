import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import styled from 'styled-components/native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

const Container = styled.View`
  flex: 1;
  background-color: ${props => themes[props.currentTheme || 'light'].colors.background};
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
  padding: ${props => themes[props.currentTheme || 'light'].spacing.large}px;
`;

const Title = styled.Text`
  font-size: ${props => themes[props.currentTheme || 'light'].typography.xlarge}px;
  font-weight: bold;
  color: ${props => themes[props.currentTheme || 'light'].colors.primary};
  text-align: center;
  margin-bottom: ${props => themes[props.currentTheme || 'light'].spacing.large}px;
`;

const Description = styled.Text`
  font-size: ${props => themes[props.currentTheme || 'light'].typography.medium}px;
  color: ${props => themes[props.currentTheme || 'light'].colors.text};
  text-align: center;
  margin-bottom: ${props => themes[props.currentTheme || 'light'].spacing.xlarge}px;
  line-height: 24px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  padding: ${props => themes[props.currentTheme || 'light'].spacing.large}px;
  gap: ${props => themes[props.currentTheme || 'light'].spacing.medium}px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${props => 
    props.variant === 'secondary' ? 'transparent' : themes[props.currentTheme || 'light'].colors.primary};
  padding: ${props => themes[props.currentTheme || 'light'].spacing.medium}px;
  border-radius: ${props => themes[props.currentTheme || 'light'].borderRadius.medium}px;
  align-items: center;
  border-width: ${props => (props.variant === 'secondary' ? 1 : 0)}px;
  border-color: ${props => themes[props.currentTheme || 'light'].colors.primary};
`;

const ButtonText = styled.Text`
  color: ${props => 
    props.variant === 'secondary' ? themes[props.currentTheme || 'light'].colors.primary : themes[props.currentTheme || 'light'].colors.white};
  font-size: ${props => themes[props.currentTheme || 'light'].typography.medium}px;
  font-weight: bold;
`;

const ProgressDots = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: ${props => themes[props.currentTheme || 'light'].spacing.large}px;
  gap: ${props => themes[props.currentTheme || 'light'].spacing.small}px;
`;

const Dot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => 
    props.active ? themes[props.currentTheme || 'light'].colors.primary : themes[props.currentTheme || 'light'].colors.border};
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
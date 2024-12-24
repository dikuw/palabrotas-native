import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import styled from 'styled-components/native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

const Container = styled.View`
  flex: 1;
  background-color: ${props => {
    return themes[props.currentTheme].colors.background;
  }};
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
  padding: ${props => themes[props.currentTheme].spacing.large}px;
`;

const Title = styled.Text`
  font-size: ${props => themes[props.currentTheme].typography.xlarge}px;
  font-weight: bold;
  color: ${props => themes[props.currentTheme].colors.primary};
  text-align: center;
  margin-bottom: ${props => themes[props.currentTheme].spacing.large}px;
`;

const Description = styled.Text`
  font-size: ${props => themes[props.currentTheme].typography.medium}px;
  color: ${props => themes[props.currentTheme].colors.text};
  text-align: center;
  margin-bottom: ${props => themes[props.currentTheme].spacing.xlarge}px;
  line-height: 24px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  padding: ${props => themes[props.currentTheme].spacing.large}px;
  gap: ${props => themes[props.currentTheme].spacing.medium}px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${props => 
    props.variant === 'secondary' ? 'transparent' : themes[props.currentTheme].colors.primary};
  padding: ${props => themes[props.currentTheme].spacing.medium}px;
  border-radius: ${props => themes[props.currentTheme].borderRadius.medium}px;
  align-items: center;
  border-width: ${props => (props.variant === 'secondary' ? 1 : 0)}px;
  border-color: ${props => themes[props.currentTheme].colors.primary};
`;

const ButtonText = styled.Text`
  color: ${props => 
    props.variant === 'secondary' ? themes[props.currentTheme].colors.primary : themes[props.currentTheme].colors.white};
  font-size: ${props => themes[props.currentTheme].typography.medium}px;
  font-weight: bold;
`;

const ProgressDots = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: ${props => themes[props.currentTheme].spacing.large}px;
  gap: ${props => themes[props.currentTheme].spacing.small}px;
`;

const Dot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => 
    props.active ? themes[props.currentTheme].colors.primary : themes[props.currentTheme].colors.border};
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
  const theme = useThemeStore(state => state.theme);

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
    <Container currentTheme={theme}>
      <ContentContainer currentTheme={theme}>
        <Title currentTheme={theme}>{t(introPages[currentPage].title)}</Title>
        <Description currentTheme={theme}>
          {t(introPages[currentPage].description)}
        </Description>

        <ProgressDots currentTheme={theme}>
          {introPages.map((_, index) => (
            <Dot key={index} active={index === currentPage} currentTheme={theme} />
          ))}
        </ProgressDots>
      </ContentContainer>

      <ButtonContainer currentTheme={theme}>
        <Button currentTheme={theme} onPress={handleGetStarted}>
          <ButtonText currentTheme={theme}>
            {currentPage < introPages.length - 1 
              ? t("Next")
              : t("Get Started")}
          </ButtonText>
        </Button>

        <Button currentTheme={theme} variant="secondary" onPress={handleLogin}>
          <ButtonText currentTheme={theme} variant="secondary">
            {t("I already have an account")}
          </ButtonText>
        </Button>
      </ButtonContainer>
    </Container>
  );
}
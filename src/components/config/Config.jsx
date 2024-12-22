import React from 'react';
import { useTranslation } from "react-i18next";
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.large}px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.xlarge}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

const Section = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.medium}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
`;

const OptionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium}px;
  background-color: ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primary : theme.colors.almostWhite};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
`;

const OptionText = styled.Text`
  font-size: ${({ theme }) => theme.typography.medium}px;
  color: ${({ isSelected, theme }) => 
    isSelected ? theme.colors.white : theme.colors.text};
`;

export default function Config() {
  const { t, i18n } = useTranslation();
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <Container>
      <Title>{t("Settings")}</Title>

      <Section>
        <SectionTitle>{t("Language")}</SectionTitle>
        {languages.map((language) => (
          <OptionButton
            key={language.code}
            isSelected={i18n.language === language.code}
            onPress={() => handleLanguageChange(language.code)}
          >
            <OptionText isSelected={i18n.language === language.code}>
              {language.name}
            </OptionText>
          </OptionButton>
        ))}
      </Section>
    </Container>
  );
}
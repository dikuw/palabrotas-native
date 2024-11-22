import React from 'react';
import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

const StyledFooter = styled.View`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium}px ${({ theme }) => theme.spacing.medium}px 0;
  background-color: ${({ theme }) => theme.colors.primary};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.primary};
`;

const StyledLegal = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-bottom: ${({ theme }) => theme.spacing.medium}px;
`;

const FooterText = styled.Text`
  color: ${({ theme }) => theme.colors.almostWhite};
  font-size: ${({ theme }) => theme.typography.small}px;
`;

const LinkText = styled.Text`
  color: ${({ theme }) => theme.colors.almostWhite};
  font-size: ${({ theme }) => theme.typography.small}px;
  text-decoration-line: underline;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export default function Footer() {
  const { t } = useTranslation();

  const handleLinkPress = () => {
    Linking.openURL('http://www.dikuw.com/');
  };

  return (
    <StyledFooter>
      <StyledLegal>
        <FooterText>&copy; 2024</FooterText>
        <Row>
          <FooterText>{t("Created with")}</FooterText>
          <LinkText onPress={handleLinkPress}> 🖤</LinkText>
        </Row>
      </StyledLegal>
    </StyledFooter>
  );
}
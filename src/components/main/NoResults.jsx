import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xlarge}px;
`;

const Message = styled.Text`
  font-size: ${({ theme }) => theme.typography.large}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.medium}px;
`;

export default function NoResults() {
  const { t } = useTranslation();

  return (
    <Container>
      <Icon name="search-off" size={48} color={theme.colors.textSecondary} />
      <Message>{t("No results found")}</Message>
    </Container>
  );
}
import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';
import Logo from './Logo';

const HeaderContainer = styled.View`
  margin-bottom: ${props => themes[props.currentTheme].spacing.medium}px;
  background-color: transparent;
  border-bottom-width: 0;
`;

const HeaderContent = styled.View`
  padding: ${props => themes[props.currentTheme].spacing.small}px;
  align-items: center;
`;

export default function Header() {
  const theme = useThemeStore(state => state.theme);

  return (
    <HeaderContainer currentTheme={theme}>
      <HeaderContent currentTheme={theme}>
        <Logo />
      </HeaderContent>
    </HeaderContainer>
  );
}
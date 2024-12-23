import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';
import Logo from './Logo';

const HeaderContainer = styled.View`
  margin-bottom: ${props => themes[props.currentTheme].spacing.medium}px;
  background-color: ${props => themes[props.currentTheme].colors.background};
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.1;
      shadow-radius: 2px;
    `,
    android: `
      elevation: 3;
    `
  })}
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
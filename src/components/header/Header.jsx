import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import Logo from './Logo';

const HeaderContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
  background-color: ${({ theme }) => theme.colors.background};
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
  padding: ${({ theme }) => theme.spacing.small}px;
  align-items: center;
`;

export default function Header() {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo />
      </HeaderContent>
    </HeaderContainer>
  );
}
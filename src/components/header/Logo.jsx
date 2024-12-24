import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

const LogoContainer = styled.View`
  align-items: center;
  padding: ${props => themes[props.currentTheme].spacing.medium}px;
`;

const StyledImage = styled(Image)`
  width: 200px;
  height: 50px;
  resize-mode: contain;
`;

export default function Logo() {
  const navigation = useNavigation();
  const theme = useThemeStore(state => state.theme);

  const logoSource = theme === 'dark' 
    ? require('../../assets/images/logoWhite.png')
    : require('../../assets/images/logo.png');

  return (
    <LogoContainer currentTheme={theme}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <StyledImage 
          source={logoSource}
          accessibilityLabel="Palabrotas Logo"
        />
      </TouchableOpacity>
    </LogoContainer>
  );
}
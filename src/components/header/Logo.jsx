import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

const LogoContainer = styled.View`
  align-items: center;
  padding: ${props => props.theme.spacing.medium}px;
`;

const StyledImage = styled(Image)`
  width: 200px;
  height: 50px;
  resize-mode: contain;
`;

export default function Logo() {
  const navigation = useNavigation();

  return (
    <LogoContainer>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <StyledImage 
          source={require('../../assets/images/logo.png')} 
          accessibilityLabel="Palabrotas Logo"
        />
      </TouchableOpacity>
    </LogoContainer>
  );
}
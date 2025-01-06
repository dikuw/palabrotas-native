import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

const BurgerButton = styled(TouchableOpacity)`
  padding: ${props => themes[props.currentTheme || 'light'].spacing.small}px;
`;

const BurgerLine = styled.View`
  width: 25px;
  height: 2px;
  background-color: ${props => themes[props.currentTheme || 'light'].colors.text};
  margin: 4px 0;
`;

export default function Burger({ onPress }) {
  const theme = useThemeStore(state => state.theme);

  return (
    <BurgerButton onPress={onPress} currentTheme={theme}>
      <BurgerLine currentTheme={theme} />
      <BurgerLine currentTheme={theme} />
      <BurgerLine currentTheme={theme} />
    </BurgerButton>
  );
}
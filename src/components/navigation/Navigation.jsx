import React, { useState } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

const Nav = styled.View`
  width: 100%;
  padding: ${props => themes[props.currentTheme || 'light'].spacing.medium}px;
  background-color: ${props => props.currentTheme === 'dark' ? '#121212' : '#ffffff'};
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

const MenuButton = styled(TouchableOpacity)`
  padding: ${props => themes[props.currentTheme || 'light'].spacing.small}px;
`;

const MenuContainer = styled.View`
  position: absolute;
  top: 100%;
  right: ${props => themes[props.currentTheme || 'light'].spacing.medium}px;
  background-color: ${props => props.currentTheme === 'dark' ? '#121212' : '#ffffff'};
  border-radius: ${props => themes[props.currentTheme || 'light'].borderRadius.medium}px;
  padding: ${props => themes[props.currentTheme || 'light'].spacing.small}px 0;
  min-width: 200px;
  z-index: 1000;
  elevation: 5;
  border-width: ${props => props.currentTheme === 'dark' ? '1px' : '0px'};
  border-color: ${props => props.currentTheme === 'dark' ? '#ffffff' : 'transparent'};
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.25;
      shadow-radius: 3.84px;
    `,
    android: `
      elevation: 5;
    `
  })}
`;

const NavigationContainer = styled.View`
  z-index: 999;
  elevation: 5;
`;

const MenuItem = styled(TouchableOpacity)`
  padding: ${props => themes[props.currentTheme || 'light'].spacing.medium}px;
`;

const MenuText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.currentTheme === 'dark' ? '#ffffff' : '#000000'};
`;

export default function Navigation({ isLoggedIn, isAdmin, logoutUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);

  const handleNavigation = (route) => {
    setIsOpen(false);
    navigation.navigate(route);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logoutUser();
    navigation.navigate('Home');
  };

  return (
    <NavigationContainer>
      <Nav currentTheme={theme}>
        <MenuButton currentTheme={theme} onPress={() => setIsOpen(!isOpen)}>
          <MenuText currentTheme={theme}>{isOpen ? "X" : "☰"}</MenuText>
        </MenuButton>

        {isOpen && (
          <MenuContainer currentTheme={theme}>
            <MenuItem currentTheme={theme} onPress={() => handleNavigation('Home')}>
              <MenuText currentTheme={theme}>{t('Home')}</MenuText>
            </MenuItem>

            {isLoggedIn ? (
              <>
                <MenuItem currentTheme={theme} onPress={() => handleNavigation('Account')}>
                  <MenuText currentTheme={theme}>{t('Account')}</MenuText>
                </MenuItem>
                <MenuItem currentTheme={theme} onPress={() => handleNavigation('Flashcards')}>
                  <MenuText currentTheme={theme}>{t('Flashcards')}</MenuText>
                </MenuItem>
                <MenuItem currentTheme={theme} onPress={() => handleNavigation('AddContent')}>
                  <MenuText currentTheme={theme}>{t('Add Content')}</MenuText>
                </MenuItem>
                {isAdmin && (
                  <MenuItem currentTheme={theme} onPress={() => handleNavigation('Admin')}>
                    <MenuText currentTheme={theme}>{t('Admin')}</MenuText>
                  </MenuItem>
                )}
                <MenuItem currentTheme={theme} onPress={handleLogout}>
                  <MenuText currentTheme={theme}>{t('Logout')}</MenuText>
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem currentTheme={theme} onPress={() => handleNavigation('Login')}>
                  <MenuText currentTheme={theme}>{t('Login')}</MenuText>
                </MenuItem>
                <MenuItem currentTheme={theme} onPress={() => handleNavigation('Register')}>
                  <MenuText currentTheme={theme}>{t('Register')}</MenuText>
                </MenuItem>
              </>
            )}

            <MenuItem currentTheme={theme} onPress={() => handleNavigation('Config')}>
              <MenuText currentTheme={theme}>{t('Settings')}</MenuText>
            </MenuItem>
          </MenuContainer>
        )}
      </Nav>
    </NavigationContainer>
  );
}
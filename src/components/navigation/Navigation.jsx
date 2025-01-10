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
  background-color: transparent;
  border-width: 0;
`;

const MenuButton = styled(TouchableOpacity)`
  padding: ${props => themes[props.currentTheme || 'light'].spacing.small}px;
`;

const MenuContainer = styled.View`
  position: absolute;
  top: 100%;
  right: ${props => themes[props.currentTheme || 'light'].spacing.medium}px;
  background-color: ${props => themes[props.currentTheme || 'light'].colors.background};
  border-radius: ${props => themes[props.currentTheme || 'light'].borderRadius.medium}px;
  padding: ${props => themes[props.currentTheme || 'light'].spacing.small}px 0;
  min-width: 200px;
  z-index: 1000;
  border-width: 0;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const NavigationContainer = styled.View`
  z-index: 999;
`;

const MenuItem = styled(TouchableOpacity)`
  padding: ${props => themes[props.currentTheme || 'light'].spacing.medium}px;
`;

const MenuText = styled.Text`
  font-size: ${props => props.isMenuIcon ? '24px' : '16px'};
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
          <MenuText currentTheme={theme} isMenuIcon={true}>{isOpen ? "X" : "☰"}</MenuText>
        </MenuButton>

        {isOpen && (
          <MenuContainer currentTheme={theme}>
            <MenuItem currentTheme={theme} onPress={() => handleNavigation('Home')}>
              <MenuText currentTheme={theme} isMenuIcon={false}>{t('Home')}</MenuText>
            </MenuItem>

            {isLoggedIn ? (
              <>
                <MenuItem currentTheme={theme} onPress={() => handleNavigation('Account')}>
                  <MenuText currentTheme={theme} isMenuIcon={false}>{t('Account')}</MenuText>
                </MenuItem>
                <MenuItem currentTheme={theme} onPress={() => handleNavigation('Flashcards')}>
                  <MenuText currentTheme={theme} isMenuIcon={false}>{t('Flashcards')}</MenuText>
                </MenuItem>
                <MenuItem currentTheme={theme} onPress={() => handleNavigation('AddContent')}>
                  <MenuText currentTheme={theme} isMenuIcon={false}>{t('Add Content')}</MenuText>
                </MenuItem>
                {isAdmin && (
                  <MenuItem currentTheme={theme} onPress={() => handleNavigation('Admin')}>
                    <MenuText currentTheme={theme} isMenuIcon={false}>{t('Admin')}</MenuText>
                  </MenuItem>
                )}
                <MenuItem currentTheme={theme} onPress={handleLogout}>
                  <MenuText currentTheme={theme} isMenuIcon={false}>{t('Logout')}</MenuText>
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem currentTheme={theme} onPress={() => handleNavigation('Login')}>
                  <MenuText currentTheme={theme} isMenuIcon={false}>{t('Login')}</MenuText>
                </MenuItem>
                <MenuItem currentTheme={theme} onPress={() => handleNavigation('Register')}>
                  <MenuText currentTheme={theme} isMenuIcon={false}>{t('Register')}</MenuText>
                </MenuItem>
              </>
            )}

            <MenuItem currentTheme={theme} onPress={() => handleNavigation('Config')}>
              <MenuText currentTheme={theme} isMenuIcon={false}>{t('Settings')}</MenuText>
            </MenuItem>
          </MenuContainer>
        )}
      </Nav>
    </NavigationContainer>
  );
}
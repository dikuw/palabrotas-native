import React, { useState } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';

const Nav = styled.View`
  width: 100%;
  padding: ${props => themes[props.currentTheme || 'light'].spacing.medium}px;
  background-color: transparent;
  border-width: 0;
  align-items: flex-start;
`;

const MenuButton = styled(TouchableOpacity)`
  padding: ${props => themes[props.currentTheme || 'light'].spacing.small}px;
`;

const MenuContainer = styled.View`
  position: absolute;
  top: 120%;
  left: ${props => themes[props.currentTheme || 'light'].spacing.medium}px;
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
  padding-left: ${props => themes[props.currentTheme || 'light'].spacing.large}px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const MenuText = styled.Text`
  font-size: ${props => props.isMenuIcon ? '24px' : '16px'};
  font-weight: bold;
  color: ${props => props.currentTheme === 'dark' ? '#ffffff' : '#000000'};
  margin-left: 10px;
`;

export default function Navigation({ isLoggedIn, isAdmin }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);

  const handleNavigation = (route) => {
    setIsOpen(false);
    navigation.navigate(route);
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
              <Icon name="home" size={16} color={theme === 'dark' ? '#ffffff' : '#000000'} />
              <MenuText currentTheme={theme} isMenuIcon={false}>{t('Home')}</MenuText>
            </MenuItem>

            {isLoggedIn ? (
              <>
                <MenuItem currentTheme={theme} onPress={() => handleNavigation('Account')}>
                  <Icon name="user" size={16} color={theme === 'dark' ? '#ffffff' : '#000000'} />
                  <MenuText currentTheme={theme} isMenuIcon={false}>{t('Account')}</MenuText>
                </MenuItem>
                <MenuItem currentTheme={theme} onPress={() => handleNavigation('Flashcards')}>
                  <Icon name="clone" size={16} color={theme === 'dark' ? '#ffffff' : '#000000'} />
                  <MenuText currentTheme={theme} isMenuIcon={false}>{t('Flashcards')}</MenuText>
                </MenuItem>
                <MenuItem currentTheme={theme} onPress={() => handleNavigation('AddContent')}>
                  <Icon name="plus-circle" size={16} color={theme === 'dark' ? '#ffffff' : '#000000'} />
                  <MenuText currentTheme={theme} isMenuIcon={false}>{t('Add Content')}</MenuText>
                </MenuItem>
                {isAdmin && (
                  <MenuItem currentTheme={theme} onPress={() => handleNavigation('Admin')}>
                    <Icon name="shield" size={16} color={theme === 'dark' ? '#ffffff' : '#000000'} />
                    <MenuText currentTheme={theme} isMenuIcon={false}>{t('Admin')}</MenuText>
                  </MenuItem>
                )}
              </>
            ) : (
              <>
                <MenuItem currentTheme={theme} onPress={() => handleNavigation('Login')}>
                  <Icon name="sign-in" size={16} color={theme === 'dark' ? '#ffffff' : '#000000'} />
                  <MenuText currentTheme={theme} isMenuIcon={false}>{t('Login')}</MenuText>
                </MenuItem>
                <MenuItem currentTheme={theme} onPress={() => handleNavigation('Register')}>
                  <Icon name="user-plus" size={16} color={theme === 'dark' ? '#ffffff' : '#000000'} />
                  <MenuText currentTheme={theme} isMenuIcon={false}>{t('Register')}</MenuText>
                </MenuItem>
              </>
            )}

            <MenuItem currentTheme={theme} onPress={() => handleNavigation('Config')}>
              <Icon name="cog" size={16} color={theme === 'dark' ? '#ffffff' : '#000000'} />
              <MenuText currentTheme={theme} isMenuIcon={false}>{t('Settings')}</MenuText>
            </MenuItem>
          </MenuContainer>
        )}
      </Nav>
    </NavigationContainer>
  );
}
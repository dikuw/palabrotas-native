import React, { useState } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

const Nav = styled.View`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium}px;
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

const MenuButton = styled(TouchableOpacity)`
  padding: ${({ theme }) => theme.spacing.small}px;
`;

const MenuContainer = styled.View`
  position: absolute;
  top: 100%;
  right: ${({ theme }) => theme.spacing.medium}px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${({ theme }) => theme.spacing.small}px 0;
  min-width: 200px;
  z-index: 1000;
  elevation: 5;
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
  padding: ${({ theme }) => theme.spacing.medium}px;
`;

const MenuText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

export default function Navigation({ isLoggedIn, isAdmin, logoutUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation();

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
      <Nav>
        <MenuButton onPress={() => setIsOpen(!isOpen)}>
          <MenuText>{isOpen ? "X" : "☰"}</MenuText>
        </MenuButton>

        {isOpen && (
          <MenuContainer>
            <MenuItem onPress={() => handleNavigation('Home')}>
              <MenuText>{t('Home')}</MenuText>
            </MenuItem>

            {isLoggedIn ? (
              <>
                <MenuItem onPress={() => handleNavigation('Account')}>
                  <MenuText>{t('Account')}</MenuText>
                </MenuItem>
                <MenuItem onPress={() => handleNavigation('Flashcards')}>
                  <MenuText>{t('Flashcards')}</MenuText>
                </MenuItem>
                <MenuItem onPress={() => handleNavigation('AddContent')}>
                  <MenuText>{t('Add Content')}</MenuText>
                </MenuItem>
                {isAdmin && (
                  <MenuItem onPress={() => handleNavigation('Admin')}>
                    <MenuText>{t('Admin')}</MenuText>
                  </MenuItem>
                )}
                <MenuItem onPress={handleLogout}>
                  <MenuText>{t('Logout')}</MenuText>
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem onPress={() => handleNavigation('Login')}>
                  <MenuText>{t('Login')}</MenuText>
                </MenuItem>
                <MenuItem onPress={() => handleNavigation('Register')}>
                  <MenuText>{t('Register')}</MenuText>
                </MenuItem>
              </>
            )}

            <MenuItem onPress={() => handleNavigation('Config')}>
              <MenuText>{t('Settings')}</MenuText>
            </MenuItem>
          </MenuContainer>
        )}
      </Nav>
    </NavigationContainer>
  );
}
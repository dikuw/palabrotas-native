import React, { useState } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

const MenuIcon = styled(Icon)`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
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

const MenuItem = styled(TouchableOpacity)`
  padding: ${({ theme }) => theme.spacing.medium}px;
`;

const MenuText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.regular}px;
`;

export default function Navigation({ isLoggedIn, isAdmin, logoutUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();

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
    <Nav>
      <MenuButton onPress={() => setIsOpen(!isOpen)}>
        <MenuIcon name={isOpen ? 'close' : 'menu'} />
      </MenuButton>

      {isOpen && (
        <MenuContainer>
          <MenuItem onPress={() => handleNavigation('Home')}>
            <MenuText>Home</MenuText>
          </MenuItem>

          {isLoggedIn ? (
            <>
              <MenuItem onPress={() => handleNavigation('Account')}>
                <MenuText>Account</MenuText>
              </MenuItem>
              <MenuItem onPress={() => handleNavigation('Flashcards')}>
                <MenuText>Flashcards</MenuText>
              </MenuItem>
              <MenuItem onPress={() => handleNavigation('AddContent')}>
                <MenuText>Add Content</MenuText>
              </MenuItem>
              {isAdmin && (
                <MenuItem onPress={() => handleNavigation('Admin')}>
                  <MenuText>Admin</MenuText>
                </MenuItem>
              )}
              <MenuItem onPress={handleLogout}>
                <MenuText>Logout</MenuText>
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onPress={() => handleNavigation('Login')}>
                <MenuText>Login</MenuText>
              </MenuItem>
              <MenuItem onPress={() => handleNavigation('Register')}>
                <MenuText>Register</MenuText>
              </MenuItem>
            </>
          )}
        </MenuContainer>
      )}
    </Nav>
  );
}
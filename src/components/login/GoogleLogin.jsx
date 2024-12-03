import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Using FontAwesome instead of Fa6
import { useAuthStore } from '../../store/auth';
import { useNotificationStore } from '../../store/notification';

const GoogleButton = styled.TouchableOpacity`
  background-color: #4285f4;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  padding: 10px 24px;
  align-self: center;
  border-radius: 4px;
  min-width: 220px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 14px;
  margin-left: 12px;
`;

const IconContainer = styled.View`
  width: 18px;
  height: 18px;
  justify-content: center;
  align-items: center;
`;

export default function GoogleLogin() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { googleLogin } = useAuthStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      navigation.navigate('Home');
      addNotification(t('Logged in successfully!'), 'success');
    } catch (error) {
      addNotification(t('Login failed. Please try again.'), 'error');
    }
  };

  return (
    <GoogleButton onPress={handleGoogleLogin}>
      <IconContainer>
        <Icon name="google" size={18} color="white" />
      </IconContainer>
      <ButtonText>{t("Continue with Google")}</ButtonText>
    </GoogleButton>
  );
}
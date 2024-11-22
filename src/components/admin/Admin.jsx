import React from 'react';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

const StyledView = styled.View`
  flex: 1;
  width: 90%;
  max-width: 1000px;
  margin: 30px auto;
  justify-content: center;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
`;

export default function Admin() {
  const navigation = useNavigation();

  const goBack = () => {
    navigation.navigate("Home");
  };

  return (
    <StyledView>
      <BackButton onPress={goBack}>
        <ButtonText>Back to Site</ButtonText>
      </BackButton>
    </StyledView>
  );
}
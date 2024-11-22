import React from 'react';
import styled from 'styled-components/native';

const NoPermissionContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const NoPermissionText = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

export default function NoPermission({ message }) {
  return (
    <NoPermissionContainer>
      <NoPermissionText>{message}</NoPermissionText>
    </NoPermissionContainer>
  );
}
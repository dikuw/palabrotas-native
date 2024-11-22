import React from 'react';
import styled from 'styled-components/native';

const BannerContainer = styled.View`
  padding: 10px;
  margin: 10px 0;
  background-color: ${props => props.theme.colors.primary};
`;

const BannerText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

export default function Banner({ title }) {
  return (
    <BannerContainer>
      <BannerText>{title}</BannerText>
    </BannerContainer>
  );
}
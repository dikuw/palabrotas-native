import React from 'react';
import { useTranslation } from "react-i18next";
import styled from 'styled-components/native';

const BannerContainer = styled.View`
  width: 100%;
  background-color: ${props => props.theme.colors.secondary};
  padding: 7px 10px;
`;

const BannerText = styled.Text`
  color: ${props => props.theme.colors.white};
  text-align: center;
`;

export default function TopBanner(props) {
  const { t } = useTranslation();

  return (
    <BannerContainer>
      <BannerText>
        {t("Welcome")} {t(props.name)}!
      </BannerText>
    </BannerContainer>
  );
}
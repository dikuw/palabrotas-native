import React from 'react';
import { Picker } from '@react-native-picker/picker';
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

const SelectContainer = styled.View`
  position: absolute;
  right: 4px;
  top: 8px;
  width: 120px;
  height: 30px;
  ${Platform.select({
    ios: `
      background-color: transparent;
    `,
    android: `
      background-color: ${props => props.theme.colors.primary};
    `
  })}
`;

const StyledPicker = styled(Picker)`
  width: 100%;
  height: 100%;
  color: ${props => props.theme.colors.white};
`;

export default function TopBanner(props) {
  const { t, i18n } = useTranslation();

  const handleChange = (value) => {
    i18n.changeLanguage(value);
  };
  
  return (
    <BannerContainer>
      <BannerText>
        {t("Welcome")} {props.name}!
      </BannerText>
      <SelectContainer>
        <StyledPicker
          selectedValue={i18n.language}
          onValueChange={handleChange}
          mode="dropdown"
        >
          <StyledPicker.Item label={t("Spanish")} value="es" />
          <StyledPicker.Item label={t("English")} value="en-US" />
        </StyledPicker>
      </SelectContainer>
    </BannerContainer>
  );
}
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTranslation } from "react-i18next";

import { useContentStore } from '../../store/content';
import { useTagStore } from '../../store/tag';
import { countries } from '../shared/countries';

const SearchBarContainer = styled.View`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.large}px;
  align-items: center;
`;

const SearchInputWrapper = styled.View`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

const SearchBarInner = styled.View`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 5px 10px;
  background-color: ${({ theme }) => theme.colors.white};
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.1;
      shadow-radius: 2px;
    `,
    android: `
      elevation: 2;
    `
  })}
`;

const SearchInput = styled.TextInput`
  flex: 1;
  padding: 5px;
  font-size: ${({ theme }) => theme.typography.regular}px;
  color: ${({ theme }) => theme.colors.text};
`;

const SearchIconWrapper = styled.TouchableOpacity`
  padding: 5px;
`;

export default function SearchBar() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  
  const { searchContents, clearSearch, filterByCountries, filterByTags } = useContentStore();
  const { getTags, tags } = useTagStore();

  useEffect(() => {
    getTags();
  }, []);

  const countryOptions = countries.map(country => ({
    label: t(`${country.name}`),
    value: country.code
  }));

  const tagOptions = tags.map(tag => ({
    label: tag.name,
    value: tag._id
  }));

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchContents(searchTerm);
      setSearchTerm('');
    } else {
      clearSearch();
    }
  };

  const handleCountryChange = (items) => {
    setSelectedCountries(items);
    filterByCountries(items);
  };

  const handleTagChange = (items) => {
    setSelectedTags(items);
    filterByTags(items);
  };

  return (
    <SearchBarContainer>
      <SearchInputWrapper>
        <SearchBarInner>
          <SearchInput
            placeholder={t("Search...")}
            value={searchTerm}
            onChangeText={(text) => {
              setSearchTerm(text);
              if (!text.trim()) {
                clearSearch();
              }
            }}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          <SearchIconWrapper onPress={handleSearch}>
            <Icon name="search" size={20} color="#666" />
          </SearchIconWrapper>
        </SearchBarInner>

        <DropDownPicker
          open={countryOpen}
          setOpen={setCountryOpen}
          value={selectedCountries}
          setValue={setSelectedCountries}
          items={countryOptions}
          multiple={true}
          min={0}
          placeholder={t("Select countries...")}
          onChangeValue={handleCountryChange}
          style={{
            borderRadius: 20,
            borderColor: '#ccc',
          }}
          textStyle={{
            fontSize: 14
          }}
          containerStyle={{
            marginTop: 10
          }}
          zIndex={3000}
        />

        <DropDownPicker
          open={tagOpen}
          setOpen={setTagOpen}
          value={selectedTags}
          setValue={setSelectedTags}
          items={tagOptions}
          multiple={true}
          min={0}
          placeholder={t("Select tags...")}
          onChangeValue={handleTagChange}
          style={{
            borderRadius: 20,
            borderColor: '#ccc',
          }}
          textStyle={{
            fontSize: 14
          }}
          containerStyle={{
            marginTop: 10
          }}
          zIndex={2000}
        />
      </SearchInputWrapper>
    </SearchBarContainer>
  );
}
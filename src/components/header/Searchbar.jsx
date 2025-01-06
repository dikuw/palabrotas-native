import React, { useState, useEffect, useCallback } from 'react';
import { Platform, View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTranslation } from "react-i18next";
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

import { useContentStore } from '../../store/content';
import { useTagStore } from '../../store/tag';
import { countries } from '../shared/countries';

export default function SearchBar() {
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  
  const { searchContents, clearSearch, filterByCountries, filterByTags } = useContentStore();
  const { getTags, tags } = useTagStore();

  const styles = {
    container: {
      width: '100%',
      padding: themes[theme].spacing.large,
      alignItems: 'center',
    },
    inputWrapper: {
      width: '100%',
      gap: themes[theme].spacing.medium,
    },
    searchBarInner: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: themes[theme].colors.border,
      borderRadius: 20,
      padding: '5px 10px',
      backgroundColor: themes[theme].colors.white,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    input: {
      flex: 1,
      padding: 5,
      fontSize: themes[theme].typography.regular,
      color: '#000000',
    },
    iconWrapper: {
      padding: 5,
    },
    dropdownStyle: {
      borderRadius: 20,
      borderColor: themes[theme].colors.border,
    },
    dropdownContainerStyle: {
      marginTop: 10,
    },
    dropdownTextStyle: {
      fontSize: 14,
      color: themes[theme].colors.text,
    },
  };

  useEffect(() => {
    getTags();
  }, []);

  const handleCountryChange = useCallback((items) => {
    setSelectedCountries(items);
    setCountryOpen(false);
    filterByCountries(items);
    if (searchTerm.trim()) {
      searchContents(searchTerm);
    } else {
      searchContents('');
    }
  }, [filterByCountries, searchContents, searchTerm]);

  const handleTagChange = useCallback((items) => {
    setSelectedTags(items);
    setTagOpen(false);
    filterByTags(items);
    if (searchTerm.trim()) {
      searchContents(searchTerm);
    } else {
      searchContents('');
    }
  }, [filterByTags, searchContents, searchTerm]);

  const handleTextChange = useCallback((text) => {
    setSearchTerm(text);
    if (!text.trim()) {
      clearSearch();
    } else {
      searchContents(text);
    }
  }, [clearSearch, searchContents]);

  const countryOptions = React.useMemo(() => 
    countries.map(country => ({
      label: t(`${country.name}`),
      value: country.code
    }))
  , [t]);

  const tagOptions = React.useMemo(() => 
    tags?.map(tag => ({
      label: tag.name,
      value: tag._id
    })) || []
  , [tags]);

  const dropdownProps = {
    mode: "BADGE",
    showBadgeDot: false,
    badgeColors: [themes[theme].colors.primary],
    badgeTextStyle: {
      color: themes[theme].colors.white,
      fontSize: 12,
      marginRight: 5,
    },
    listMode: "SCROLLVIEW",
    badgeDotColors: ["transparent"],
    removable: true,
    showArrowIcon: true,
    closeOnBackPressed: true,
    badgeProps: {
      closeIconStyle: {
        color: themes[theme].colors.white,
        fontSize: 14,
        fontWeight: 'bold',
      },
      dotStyle: { display: 'none' },
      badgeStyle: {
        padding: 8,
        paddingRight: 25,
      },
      iconStyle: {
        right: 5,
        top: '25%',
      },
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={styles.searchBarInner}>
          <TextInput
            style={styles.input}
            placeholder={t("Search...")}
            value={searchTerm}
            onChangeText={handleTextChange}
            returnKeyType="search"
            clearButtonMode="while-editing"
            placeholderTextColor={themes[theme].colors.textSecondary}
            underlineColorAndroid="transparent"
          />
          {searchTerm ? (
            <TouchableOpacity 
              style={styles.iconWrapper} 
              onPress={() => {
                setSearchTerm('');
                clearSearch();
              }}
            >
              <Icon name="times" size={20} color={themes[theme].colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>

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
          style={styles.dropdownStyle}
          containerStyle={styles.dropdownContainerStyle}
          textStyle={styles.dropdownTextStyle}
          zIndex={3000}
          theme={theme === 'dark' ? 'DARK' : 'LIGHT'}
          {...dropdownProps}
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
          style={styles.dropdownStyle}
          containerStyle={styles.dropdownContainerStyle}
          textStyle={styles.dropdownTextStyle}
          zIndex={2000}
          theme={theme === 'dark' ? 'DARK' : 'LIGHT'}
          {...dropdownProps}
        />
      </View>
    </View>
  );
}
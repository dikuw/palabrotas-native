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
      gap: 15,
    },
    searchBarContainer: {
      position: 'relative',
      width: '100%',
      height: 46,
    },
    searchBarBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: -7,
      bottom: -7,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: theme === 'dark' ? '#ffffff' : '#000000',
      borderRadius: 20,
      backgroundColor: 'transparent',
      zIndex: 1,
    },
    searchBarInner: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 20,
      height: 46,
      padding: '5px 15px',
      backgroundColor: 'white',
      zIndex: 2,
    },
    input: {
      flex: 1,
      padding: 5,
      fontSize: 14,
      color: '#000000',
    },
    iconWrapper: {
      padding: 5,
    },
    dropdownContainer: {
      position: 'relative',
      width: '100%',
      height: 46,
      marginBottom: 0,
    },
    dropdownBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: -7,
      bottom: -7,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: theme === 'dark' ? '#ffffff' : '#000000',
      borderRadius: 20,
      backgroundColor: 'transparent',
      zIndex: 1,
    },
    dropdownStyle: {
      position: 'relative',
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 20,
      height: 46,
      backgroundColor: 'white',
      zIndex: 2,
      padding: '5px 15px',
    },
    dropdownContainerStyle: {
      marginTop: 0,
      marginBottom: 0,
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
    customItemContainerStyle: {
      backgroundColor: 'white',
    },
    ArrowUpIconComponent: ({ style }) => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          height: '90%',
          width: 1.5,
          borderLeftWidth: 1.5,
          borderLeftColor: '#000',
          borderStyle: 'dashed',
          marginRight: 10,
        }} />
        <Icon name="chevron-up" size={14} color="#000" />
      </View>
    ),
    ArrowDownIconComponent: ({ style }) => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          height: '90%',
          width: 1.5,
          borderLeftWidth: 1.5,
          borderLeftColor: '#000',
          borderStyle: 'dashed',
          marginRight: 10,
        }} />
        <Icon name="chevron-down" size={14} color="#000" />
      </View>
    ),
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
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBarBackground} />
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
        </View>

        <View style={styles.dropdownContainer}>
          <View style={styles.dropdownBackground} />
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
        </View>

        <View style={styles.dropdownContainer}>
          <View style={styles.dropdownBackground} />
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
    </View>
  );
}
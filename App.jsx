import React, { useState, useEffect } from 'react';
import './src/i18n';
import { SafeAreaView, StatusBar, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

// Import stores
import { useAuthStore } from './src/store/auth';
import { useContentStore } from './src/store/content';
import { useThemeStore } from './src/store/theme';
import { themes } from './src/styles/theme';

// Import components
import TopBanner from './src/components/header/TopBanner';
import Header from './src/components/header/Header';
import Navigation from './src/components/navigation/Navigation';
import SearchBar from './src/components/header/Searchbar';
import Grid from './src/components/main/Grid';
import Content from './src/components/content/Content';
import AddContent from './src/components/content/AddContent';
import EditContent from './src/components/content/EditContent';
import Register from './src/components/login/Register';
import LocalLogin from './src/components/login/LocalLogin';
import Account from './src/components/account/Account';
import Flashcards from './src/components/flashcards/Flashcards';
import Admin from './src/components/admin/Admin';
import NotificationContainer from './src/components/notifications/NotificationContainer';
import AddFeedback from './src/components/feedback/AddFeedback';
import AddTag from './src/components/tag/AddTag';
import Config from './src/components/config/Config';
import Intro1 from './src/components/intro/Intro1';

const Stack = createNativeStackNavigator();

const GridBackground = ({ theme }) => {
  const lines = [];
  const size = 50;
  const width = 2000;
  const height = 2000;

  // Create vertical lines
  for (let i = 0; i <= width; i += size) {
    lines.push(
      <View
        key={`v${i}`}
        style={[
          styles.verticalLine,
          {
            left: i,
            backgroundColor: themes[theme].colors.primary,
            opacity: 0.2,
          },
        ]}
      />
    );
  }

  // Create horizontal lines
  for (let i = 0; i <= height; i += size) {
    lines.push(
      <View
        key={`h${i}`}
        style={[
          styles.horizontalLine,
          {
            top: i,
            backgroundColor: themes[theme].colors.primary,
            opacity: 0.2,
          },
        ]}
      />
    );
  }

  return <View style={styles.gridPattern}>{lines}</View>;
};

const AppContainer = styled(View)`
  flex: 1;
  height: 100%;
  width: 100%;
  background-color: ${props => themes[props.currentTheme].colors.background};
`;

const LoadingText = styled(Text)`
  color: ${props => themes[props.currentTheme].colors.text};
  font-size: 16px;
  text-align: center;
  padding: 20px;
`;

function App() {
  const { t } = useTranslation();
  const { getContents, getContentsSortedByVoteDesc } = useContentStore();
  const { authStatus, loginUser, logoutUser, getCurrentUser } = useAuthStore();
  const theme = useThemeStore(state => state.theme);
  const [isLoading, setIsLoading] = useState(false);

  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  useEffect(() => {
    setIsLoading(true);
    async function initialize() {
      await getContentsSortedByVoteDesc();
      await getCurrentUser();
      setIsLoading(false);
    }
    initialize();
  }, [getContents, getContentsSortedByVoteDesc]);

  return (  
    <NavigationContainer 
      theme={{
        ...navigationTheme,
        colors: {
          ...navigationTheme.colors,
          background: 'transparent',
          card: 'transparent',
        }
      }}
    >
      <SafeAreaView style={{ 
        flex: 1,
        backgroundColor: 'transparent'
      }}>
        <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
        <AppContainer currentTheme={theme}>
          <GridBackground theme={theme} />
          <TopBanner 
            isLoggedIn={authStatus.isLoggedIn} 
            name={authStatus.user ? authStatus.user.name : "guest"} 
          />
          <Header />
          <Navigation 
            isLoggedIn={authStatus.isLoggedIn} 
            isAdmin={authStatus.user ? authStatus.user.isAdmin : false}
            logoutUser={logoutUser} 
          />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home">
              {props => (
                !authStatus.isLoggedIn ? (
                  <Intro1 {...props} />
                ) : (
                  <View style={{ 
                    flex: 1, 
                    backgroundColor: 'transparent'
                  }}>
                    <SearchBar />
                    {isLoading ? (
                      <LoadingText currentTheme={theme}>{t('Finding latest content...')}</LoadingText>
                    ) : (
                      <Grid />
                    )}
                  </View>
                )
              )}
            </Stack.Screen>

            <Stack.Screen name="Admin" options={{ title: t('Admin') }} component={Admin} />
            <Stack.Screen name="Register" options={{ title: t('Register') }} component={Register} />
            <Stack.Screen 
              name="Login" 
              options={{ title: t('Login') }}
              children={props => (
                <LocalLogin
                  {...props}
                  isLoggedIn={authStatus.isLoggedIn}
                  loginUser={loginUser}
                />
              )}
            />
            <Stack.Screen name="Content" options={{ title: t('Content') }} component={Content} />
            <Stack.Screen 
              name="Account" 
              options={{ title: t('Account') }}
              children={props => (
                <Account
                  {...props}
                  isLoggedIn={authStatus.isLoggedIn}
                />
              )}
            />
            <Stack.Screen 
              name="Flashcards" 
              options={{ title: t('Flashcards') }}
              children={props => (
                <Flashcards
                  {...props}
                  isLoggedIn={authStatus.isLoggedIn}
                />
              )}
            />
            <Stack.Screen 
              name="AddContent" 
              options={{ title: t('Add Content') }}
              children={props => (
                <AddContent
                  {...props}
                  isLoggedIn={authStatus.isLoggedIn}
                />
              )}
            />
            <Stack.Screen 
              name="EditContent" 
              options={{ title: t('Edit Content') }}
              children={props => (
                <EditContent
                  {...props}
                  isLoggedIn={authStatus.isLoggedIn}
                />
              )}
            />
            <Stack.Screen 
              name="Config" 
              options={{ title: t('Settings') }}
              children={props => (
                <Config
                  {...props}
                  isLoggedIn={authStatus.isLoggedIn}
                  logoutUser={logoutUser}
                />
              )}
            />
            <Stack.Screen 
              name="AddFeedback" 
              options={{ title: t('Add Feedback') }}
              component={AddFeedback} 
            />
            <Stack.Screen 
              name="AddTag" 
              options={{ title: t('Add Tag') }}
              children={props => (
                <AddTag
                  {...props}
                  isLoggedIn={authStatus.isLoggedIn}
                />
              )}
            />
          </Stack.Navigator>

          <NotificationContainer />
        </AppContainer>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  gridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  verticalLine: {
    position: 'absolute',
    width: 1,
    top: 0,
    bottom: 0,
  },
  horizontalLine: {
    position: 'absolute',
    height: 1,
    left: 0,
    right: 0,
  },
});

export default App;
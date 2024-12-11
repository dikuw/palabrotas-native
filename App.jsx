import React, { useState, useEffect } from 'react';
import './src/i18n';
import { SafeAreaView, View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import styled from 'styled-components/native';

// Import stores
import { useAuthStore } from './src/store/auth';
import { useContentStore } from './src/store/content';

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
import Footer from './src/components/Footer';
import AddFeedback from './src/components/feedback/AddFeedback';
import AddTag from './src/components/tag/AddTag';

import { ThemeProvider } from 'styled-components/native';

const theme = {
  colors: {
    background: '#ffffff',
    text: '#000000',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  typography: {
    small: 12,
    regular: 14,
    medium: 16,
    large: 18,
    xlarge: 24
  },
  borderRadius: {  // Add this new section
    small: 4,
    medium: 8,
    large: 16
  }
};

const Stack = createNativeStackNavigator();

const AppContainer = styled.View`
  flex: 1;
  height: 100%;
  background-color: ${props => props.theme.colors.background};
`;

const LoadingText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  text-align: center;
  padding: 20px;
`;

function App() {
  const { getContents, getContentsSortedByVoteDesc } = useContentStore();
  const { authStatus, loginUser, logoutUser, getCurrentUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

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
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <AppContainer>
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
          
          <Stack.Navigator>
            <Stack.Screen name="Home">
              {props => (
                <View style={{ flex: 1 }}>
                  <SearchBar />
                  {isLoading ? (
                    <LoadingText>Finding latest content...</LoadingText>
                  ) : (
                    <Grid />
                  )}
                </View>
              )}
            </Stack.Screen>

            <Stack.Screen name="Admin" component={Admin} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen 
              name="Login" 
              children={props => (
                <LocalLogin
                  {...props}
                  isLoggedIn={authStatus.isLoggedIn}
                  loginUser={loginUser}
                />
              )}
            />
            <Stack.Screen name="Content" component={Content} />
            <Stack.Screen 
              name="Account" 
              children={props => (
                <Account
                  {...props}
                  isLoggedIn={authStatus.isLoggedIn}
                />
              )}
            />
            <Stack.Screen 
              name="Flashcards" 
              children={props => (
                <Flashcards
                  {...props}
                  isLoggedIn={authStatus.isLoggedIn}
                />
              )}
            />
            <Stack.Screen 
              name="AddContent" 
              children={props => (
                <AddContent
                  {...props}
                  isLoggedIn={authStatus.isLoggedIn}
                />
              )}
            />
            <Stack.Screen 
              name="EditContent" 
              children={props => (
                <EditContent
                  {...props}
                  isLoggedIn={authStatus.isLoggedIn}
                />
              )}
            />
            <Stack.Screen name="AddFeedback" component={AddFeedback} />
            <Stack.Screen 
              name="AddTag" 
              children={props => (
                <AddTag
                  {...props}
                  isLoggedIn={authStatus.isLoggedIn}
                />
              )}
            />
          </Stack.Navigator>

          <NotificationContainer />
          <Footer />
        </AppContainer>
      </SafeAreaView>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { useContentStore } from '../../store/content';
import { useAuthStore } from '../../store/auth';
import { useUserStore } from '../../store/user';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import Banner from '../header/Banner';
import AccountGrid from './AccountGrid';
import Streak from './Streak';
import NoPermission from '../shared/NoPermissionDiv';

const Container = styled.View`
  width: 90%;
  max-width: 1000px;
  flex: 1;
  margin: 30px auto;
  padding: 4px;
`;

export default function Account() {
  const { t } = useTranslation();
  const { getContentsByUserId } = useContentStore(); 
  const { authStatus } = useAuthStore();
  const { getCurrentStreak, getLongestStreak } = useUserStore();
  const [userContents, setUserContents] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    async function fetchUserContents() {
      if (authStatus.isLoggedIn && authStatus.user) {
        const contents = await getContentsByUserId(authStatus.user._id);
        setUserContents(contents);

        const currentStreakData = await getCurrentStreak(authStatus.user._id);
        setCurrentStreak(currentStreakData.streak || 0);
        
        const longestStreakData = await getLongestStreak(authStatus.user._id);
        setLongestStreak(longestStreakData.streak || 0);
      }
    }
  
    fetchUserContents();
  }, [authStatus.isLoggedIn, authStatus.user, getContentsByUserId, getCurrentStreak, getLongestStreak]);
  
  if (!authStatus.isLoggedIn || !authStatus.user) {
    return <NoPermission message={t("Please log in to view this page")} />;
  }

  return (
    <Container>
      <Streak currentStreak={currentStreak} longestStreak={longestStreak} />
      <Banner title={t("Your Content")} />
      <AccountGrid contents={userContents} />
    </Container>
  );
}
import React from 'react';
import styled from 'styled-components/native';

const StreakContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 15px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  margin-bottom: 15px;
`;

const StreakBox = styled.View`
  align-items: center;
`;

const StreakNumber = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const StreakLabel = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  margin-top: 5px;
`;

export default function Streak({ currentStreak, longestStreak }) {
  return (
    <StreakContainer>
      <StreakBox>
        <StreakNumber>{currentStreak}</StreakNumber>
        <StreakLabel>Current Streak</StreakLabel>
      </StreakBox>
      <StreakBox>
        <StreakNumber>{longestStreak}</StreakNumber>
        <StreakLabel>Longest Streak</StreakLabel>
      </StreakBox>
    </StreakContainer>
  );
}
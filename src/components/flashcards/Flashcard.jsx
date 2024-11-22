import React, { useState } from 'react';
import { Animated, PanResponder, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

const CardContainer = styled(Animated.View)`
  position: absolute;
  width: 100%;
  height: 300px;
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  background-color: ${({ theme }) => theme.colors.white};
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.25;
      shadow-radius: 3.84px;
    `,
    android: `
      elevation: 5;
    `
  })}
`;

const CardContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

const CardText = styled.Text`
  font-size: ${({ theme }) => theme.typography.large}px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: ${({ theme }) => theme.spacing.medium}px;
`;

const Button = styled.TouchableOpacity`
  padding: ${({ theme }) => theme.spacing.medium}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  background-color: ${({ variant, theme }) => 
    variant === 'easy' ? theme.colors.success :
    variant === 'hard' ? theme.colors.error :
    theme.colors.primary};
`;

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.regular}px;
  font-weight: bold;
`;

export default function Flashcard({ item, onNext }) {
  const { t } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const position = new Animated.ValueXY();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    }
  });

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction) => {
    const quality = direction === 'right' ? 5 : 0;
    onNext(item._id, quality, direction === 'left');
    position.setValue({ x: 0, y: 0 });
    setIsFlipped(false);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  };

  return (
    <CardContainer
      {...panResponder.panHandlers}
      style={getCardStyle()}
    >
      <CardContent>
        <CardText>
          {isFlipped ? item.back : item.front}
        </CardText>
      </CardContent>

      <ButtonContainer>
        <Button 
          variant="hard"
          onPress={() => onNext(item._id, 0, true)}
        >
          <ButtonText>{t("Hard")}</ButtonText>
        </Button>

        <Button 
          onPress={() => setIsFlipped(!isFlipped)}
        >
          <ButtonText>{t("Flip")}</ButtonText>
        </Button>

        <Button 
          variant="easy"
          onPress={() => onNext(item._id, 5, false)}
        >
          <ButtonText>{t("Easy")}</ButtonText>
        </Button>
      </ButtonContainer>
    </CardContainer>
  );
}
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, PanResponder, Dimensions, Platform, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default function Flashcard({ item, onNext, totalCards }) {
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const [isFlipped, setIsFlipped] = useState(false);
  const position = new Animated.ValueXY();

  React.useEffect(() => {
    position.setValue({ x: 0, y: 0 });
  }, [item?._id]);

  const front = item?.content?.title || 'Front';
  const back = item?.content?.description || 'Back';

  const styles = {
    container: {
      height: 400,
      position: 'relative',
      backgroundColor: 'transparent',
    },
    cardCounter: {
      position: 'absolute',
      top: -30,
      width: '100%',
      alignItems: 'center',
      zIndex: 1,
    },
    cardCounterText: {
      fontSize: themes[theme].typography.small,
      color: themes[theme].colors.textSecondary,
    },
    cardContainer: {
      position: 'absolute',
      width: '100%',
      height: 300,
      borderRadius: themes[theme].borderRadius.large,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#000000',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        android: {
          elevation: 5,
        }
      }),
    },
    cardContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: themes[theme].spacing.large,
    },
    cardText: {
      fontSize: 24,
      color: '#000000',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: themes[theme].spacing.medium,
      backgroundColor: 'transparent',
    },
    button: (variant) => ({
      padding: themes[theme].spacing.medium,
      borderRadius: themes[theme].borderRadius.medium,
      backgroundColor: 
        variant === 'easy' ? themes[theme].colors.success :
        variant === 'hard' ? themes[theme].colors.error :
        themes[theme].colors.primary,
      minWidth: 80,
    }),
    buttonText: {
      color: themes[theme].colors.white,
      fontSize: themes[theme].typography.regular,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: 0 });
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
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    const quality = direction === 'right' ? 5 : 0;
    
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true
    }).start(() => {
      setIsFlipped(false);
      onNext(item._id, quality, direction === 'left');
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true
    }).start();
  };

  const getCardStyle = () => {
    return {
      transform: [
        { translateX: position.x }
      ]
    };
  };

  const handleHardPress = () => {
    forceSwipe('left');
  };

  const handleEasyPress = () => {
    forceSwipe('right');
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardCounter}>
        <Text style={styles.cardCounterText}>
          {t("{{count}} cards remain", { count: totalCards })}
        </Text>
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.cardContainer, getCardStyle()]}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>
            {isFlipped ? back : front}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button('hard')}
            onPress={handleHardPress}
          >
            <Text style={styles.buttonText}>{t("Hard")}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button()}
            onPress={() => setIsFlipped(!isFlipped)}
          >
            <Text style={styles.buttonText}>{t("Flip")}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button('easy')}
            onPress={handleEasyPress}
          >
            <Text style={styles.buttonText}>{t("Easy")}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
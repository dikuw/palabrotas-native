import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, PanResponder, Dimensions, Platform, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/theme';
import { useUserStore } from '../../store/user';
import { useAuthStore } from '../../store/auth';
import { useNotificationStore } from '../../store/notification';
import { themes } from '../../styles/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default function Flashcard({ item, onNext, isLoading, totalCards }) {
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const { updateStreak } = useUserStore();
  const { authStatus } = useAuthStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentItem, setCurrentItem] = useState(item);
  const position = new Animated.ValueXY();

  useEffect(() => {
    setCurrentItem(item);
    setIsFlipped(false);
    position.setValue({ x: 0, y: 0 });
  }, [item?._id]);

  useEffect(() => {
    if (isLoading) {
      setIsFlipped(false);
    }
  }, [isLoading]);

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
        handleAnswer('Easy');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        handleAnswer('Again');
      } else {
        resetPosition();
      }
    }
  });

  const handleAnswer = async (quality) => {
    if (!authStatus.isLoggedIn || !authStatus.user) {
      console.error('User is not logged in');
      return;
    }

    try {
      if (quality === 'Again') {
        await onNext(currentItem._id, quality, true);
      } else {
        await onNext(currentItem._id, quality, false);
      }

      const result = await updateStreak(authStatus.user._id);
      if (result.updated) {
        addNotification(t('Streak updated! Current streak: {{streak}}', { streak: result.streak }), 'success');
      }
    } catch (error) {
      console.error('Error updating flashcard review:', error);
      addNotification(t('Error updating flashcard review'), 'error');
    }
  };

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true
    }).start(() => {
      setIsFlipped(false);
      handleAnswer(direction === 'right' ? 'Easy' : 'Again');
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
            {isFlipped ? currentItem?.content?.description : currentItem?.content?.title}
          </Text>
          {isFlipped && currentItem?.content?.exampleSentence && (
            <Text style={[styles.cardText, { fontSize: 18, marginTop: 10, fontWeight: 'normal' }]}>
              {currentItem.content.exampleSentence}
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button('hard')}
            onPress={() => forceSwipe('left')}
          >
            <Text style={styles.buttonText}>{t("Again")}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button()}
            onPress={() => setIsFlipped(!isFlipped)}
          >
            <Text style={styles.buttonText}>{t("Flip")}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button('easy')}
            onPress={() => forceSwipe('right')}
          >
            <Text style={styles.buttonText}>{t("Easy")}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
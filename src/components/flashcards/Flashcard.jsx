import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, PanResponder, Dimensions, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/theme';
import { themes } from '../../styles/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default function Flashcard({ item, onNext }) {
  const { t } = useTranslation();
  const theme = useThemeStore(state => state.theme);
  const [isFlipped, setIsFlipped] = useState(false);
  const position = new Animated.ValueXY();

  const front = item?.content?.title || 'Front';
  const back = item?.content?.description || 'Back';

  const styles = {
    container: {
      height: 400,
      position: 'relative',
      backgroundColor: 'transparent',
    },
    cardContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
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
      backgroundColor: 'transparent',
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
    <View style={styles.container}>
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
            onPress={() => onNext(item._id, 0, true)}
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
            onPress={() => onNext(item._id, 5, false)}
          >
            <Text style={styles.buttonText}>{t("Easy")}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}